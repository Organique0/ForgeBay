<x-filament-widgets::widget>
    <x-filament::section>
		  <div class="flex items-center gap-x-3">
			  <div class="flex-1">
				  <h2
					  class="grid flex-1 text-base font-semibold leading-6 text-gray-950 dark:text-white"
				  >
					  {{ __("Go to Site statistics") }}
				  </h2>
			  </div>
				  <x-filament::button
					  color="gray"
					  icon="heroicon-o-presentation-chart-line"
					  tag="a"
					  href="/pulse"
				  >
					  {{ __("Go to Site statistics") }}
				  </x-filament::button>
		  </div>
    </x-filament::section>
</x-filament-widgets::widget>
