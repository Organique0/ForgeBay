import { Moon, Sun } from "lucide-react"

import { useTheme } from '@/Components/MyComponents/theme-provider';
import { Button } from '@/Components/Shadcn/ui/button';
import theme from 'tailwindcss/defaultTheme';
import React from 'react';
import { LuSunMoon } from 'react-icons/lu';

export function ModeToggle() {
	const { setTheme, theme } = useTheme()

	return (
		<Button
			className={'fixed bottom-4 right-4'}
			onClick={() => {
			setTheme(theme === 'dark' ? 'light' : 'dark')
		}}>
			<LuSunMoon size={'30'}/>
		</Button>
	)
}
