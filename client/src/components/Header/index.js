import React from 'react';
import { Box, Flex, useColorModeValue, Stack } from '@chakra-ui/react';
import Logo from './Logo';
import TabHeader from './TabHeader';
import SearchHeader from './SearchHeader';
import MenuUserDropdown from './MenuUserDropdown';
import HeaderModeTheme from './HeaderModeTheme';

export default function Header() {
  return (
    <div className='w-full'>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Logo />
          <TabHeader />
          <SearchHeader />
          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <HeaderModeTheme />
              <MenuUserDropdown />
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </div>
  );
}
