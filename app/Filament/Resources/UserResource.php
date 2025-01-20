<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use App\RolesEnum;
use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Password;
use Spatie\Permission\Models\Role;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
               Forms\Components\TextInput::make('name')
				->required()
				->maxLength(255)
				->disabled(),
				Forms\Components\TextInput::make('email')
				->email()
				->disabled()
				->required()
				->maxLength(255),
				Forms\Components\Select::make('active')
				->options([
					true => 'Active',
					false => 'Inactive',
				]),
				Forms\Components\DateTimePicker::make('email_verified_at')
				->disabled(),

				Select::make('role')
					->label('Role')
					->options(RolesEnum::class)
					// For some reason using the default function here does not work ...
					// Even if I copy-paste the code directly from the documentation ...
					->afterStateHydrated(function (Select $component, Model $record) {
						$component->state($record->roles->first()?->name);
					})
					->afterStateUpdated(function ($state, Select $component, Model $record) {
						if ($record && $state) {
							$record->syncRoles($state);
						}
					})
					->selectablePlaceholder(false)
					->required()
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
               TextColumn::make('name')
				->searchable()
				->sortable(),
				TextColumn::make('email')
				->searchable()
				->sortable(),
				Tables\Columns\IconColumn::make('active')
				->boolean(),
				Tables\Columns\IconColumn::make('email_verified_at')
				->label('Email Verified')
				->boolean()
				->getStateUsing(fn ($record) => $record->email_verified_at !== null),
				TextColumn::make('Role')
				->getStateUsing(fn (User $user) => $user->getRoleNames())
				->badge()
				->color(fn (string $state) => match ($state) {
					'user' => 'success',
					'admin' => 'info',
					'super-admin' => 'warning',
				})
            ])
			->defaultSort('name', 'desc')
            ->filters([
               	Tables\Filters\TernaryFilter::make('active')
				->label('Active')
				->placeholder('All Users')
				->name('active'),
				Tables\Filters\TernaryFilter::make('email_verified_at')
				->label('Email Verified')
				->placeholder('All Users')
				->nullable(),
				SelectFilter::make('role')
					->label('Role')
					->options(Role::pluck('name', 'id'))
					->query(function (Builder $query, array $data) {
						return $query->when(
							$data['value'],
							fn (Builder $query, $roleId) => $query->whereHas('roles', fn ($q) => $q->where('id', $roleId))
						);
					})


			])
            ->actions([
				Tables\Actions\ViewAction::make('view')
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
					Tables\Actions\BulkAction::make('Deactivate Accounts')
					->requiresConfirmation()
					->action(fn (Collection $users) => $users->each(function ($user) {
						$user->active = false;
						$user->save();
					}))
					->deselectRecordsAfterCompletion(),
					Tables\Actions\BulkAction::make('Activate Accounts')
					->requiresConfirmation()
					->action(fn (Collection $users) => $users->each(function ($user) {
						$user->active = true;
						$user->save();
					}))
					->deselectRecordsAfterCompletion(),
					Tables\Actions\BulkAction::make('Reset Passwords')
					->requiresConfirmation()
					->action(fn (Collection $users) => $users->each(function ($user) {
						Password::sendResetLink(['email' => $user->email]);
					}))
					->deselectRecordsAfterCompletion(),
					Tables\Actions\BulkAction::make('Remove Email Verified')
					->requiresConfirmation()
					->action(fn (Collection $users) => $users->each(function ($user) {
						$user->email_verified_at = null;
						$user->save();
					}))
					->deselectRecordsAfterCompletion()
                ]),
            ])
			->checkIfRecordIsSelectableUsing(function (User $user): bool {
				$currentUser = auth()->user();
				if ($currentUser->hasRole('admin') && $user->hasRole('user')) {
					return true;
				}
				if ($currentUser->can('modify-admins') && !$user->hasRole('super-admin')) {
					return true;
				}
				return false;
			})

			;
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
			'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
