import * as React from 'react';
import { Container, chakra, Stack, Text, Button, Box, Heading } from '@chakra-ui/react';

const HeroSection = () => {
    return (
					 <Container maxW={'full'} className={'bg-red-200'}>
							 <Stack
									 as={Box}
									 textAlign={'center'}
									 gap={{ base: 8, md: 14 }}
									 py={{ base: 20, md: 28 }}>
									 <Heading
											 fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
											 fontWeight={'bold'}
											 color={'black'}>
											 <chakra.span
													 display={'block'}
													 color={'black'}>
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
											 <Button size="lg">
													 Get started
											 </Button>
									 </Stack>
							 </Stack>
					 </Container>
    );
};

export default HeroSection;
