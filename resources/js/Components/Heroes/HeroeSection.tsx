import * as React from 'react';
import { chakra, Stack, Text, Box, Heading  } from '@chakra-ui/react';
import { Button } from '@/ui/button';
const HeroSection = () => {
	return (
		<Stack
			className={''}
			as={Box}
			textAlign={'center'}
			gap={{ base: 8, md: 14 }}
			py={{ base: 20, md: 28 }}>
			<Heading
				fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
				fontWeight={'bold'}
			>
				<chakra.span
					display={'block'}
				>
					Welcome to the Forge!
				</chakra.span>
			</Heading>
			<Text>
				Here you can find people to help you forge your dream project, or you can help others with their projects.
			</Text>
			<Stack
				direction={'column'}
				gap={3}
				align={'center'}
				alignSelf={'center'}
				position={'relative'}>
				<Button size="lg" className={'dark:bg-white bg-black text-white dark:text-black'}>
					Get started
				</Button>
			</Stack>
		</Stack>
	);
};

export default HeroSection;
