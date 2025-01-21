import * as React from 'react';
import { Container, chakra, Stack, Text, Button, Box } from '@chakra-ui/react';

const HeroSection = () => {
    return (
       <div className={'bg-red-100'}>
					 <Container maxW={'3xl'}>
							 <Stack
									 as={Box}
									 textAlign={'center'}
									 spacing={{ base: 8, md: 14 }}
									 py={{ base: 20, md: 28 }}>
									 <chakra.h1
											 fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
											 fontWeight={'bold'}
											 color={'black'}>
											 <chakra.span
													 display={'block'}
													 color={'black'}>
													 Welcome to the Forge!
											 </chakra.span>
									 </chakra.h1>
									 <Text color={'gray.500'}>
											  Here you can find people to help you forge your dream project, or you can help others with their projects.
									 </Text>
									 <Stack
											 direction={'column'}
											 spacing={3}
											 align={'center'}
											 alignSelf={'center'}
											 position={'relative'}>
											 <Button
													 colorScheme={'blue'}
													 bg={'blue.400'}
													 rounded={'full'}
													 px={6}
													 _hover={{
															 bg: 'blue.500',
													 }}>
													 Get started
											 </Button>
									 </Stack>
							 </Stack>
					 </Container>
       </div>
    );
};

export default HeroSection;
