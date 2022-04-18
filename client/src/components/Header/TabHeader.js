import { Tab, TabList, Tabs } from '@chakra-ui/react';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default function TabHeader() {
  const location = useLocation();
  const history = useHistory();
  const indexTab = location.pathname === '/chat' ? 1 : 0;

  function handleChangeTab(t) {
    history.push(t === 1 ? '/chat' : '/');
  }
  return (
    <Tabs
      onChange={handleChangeTab}
      variant='soft-rounded'
      colorScheme='green'
      index={indexTab}
    >
      <TabList>
        <Tab tabIndex={1}>Todo</Tab>
        <Tab tabIndex={2}>Chat</Tab>
      </TabList>
    </Tabs>
  );
}
