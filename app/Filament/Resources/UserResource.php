<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\SelectAction;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Password;

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
				->maxLength(255),
				Forms\Components\TextInput::make('email')
					->email()
				->required()
				->maxLength(255),
				Forms\Components\Select::make('active')
				->options([
					true => 'Active',
					false => 'Inactive',
				]),
				Forms\Components\TextInput::make('email_verified_at')
				->disabled(),

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
					'admin' => 'danger',
					'seller' => 'warning',
				}),
            ])
			->defaultSort('name', 'desc')
            ->filters([
                Tables\Filters\Filter::make('Active')
				->query(fn (Builder $query): Builder => $query->where('active', true)),
				Tables\Filters\Filter::make('Inactive')
				->query(fn (Builder $query): Builder => $query->where('active', false)),
				Tables\Filters\Filter::make('Email Verified')
				->query(fn (Builder $query): Builder => $query->whereNot('email_verified_at' )),
				Tables\Filters\Filter::make('Email Not Verified')
				->query(fn (Builder $query): Builder => $query->where('email_verified_at' ))
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
			->checkIfRecordIsSelectableUsing(
				fn (User $user): bool => !$user->hasRole('admin')
			)
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
        ];
    }
}
