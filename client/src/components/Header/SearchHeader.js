/* eslint-disable react-hooks/exhaustive-deps */
import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react';
import React, { useCallback, useRef, useState } from 'react';
import SuggestList from './SuggestList';
import { useClickAway } from 'react-use';
import { SearchService } from '../../services';
import { debounce } from 'lodash';

export default function SearchHeader() {
  const [isFocus, setIsFocus] = useState(false);
  const [txtSearch, setTxtSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const ref = useRef(null);

  useClickAway(ref, () => {
    setIsFocus(false);

    if (!txtSearch) {
      setResults([]);
    }
  });

  function onChangeSearch(value) {
    setTxtSearch(value);
    if (value) {
      debouncedSearch(value);
    }
  }

  function searchUserWithInput(value) {
    setLoading(true);
    new SearchService()
      .searchUser(value)
      .then((response) => {
        setResults(response?.data?.data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const debouncedSearch = useCallback(
    debounce((nextValue) => searchUserWithInput(nextValue), 1000),
    []
  );

  return (
    <Box className='w-2/5 relative' ref={ref}>
      <InputGroup className=''>
        <Input
          placeholder='Search friend'
          value={txtSearch}
          onChange={(e) => onChangeSearch(e.target.value)}
          onFocus={() => setIsFocus(true)}
        />
        <InputRightElement
          className='cursor-pointer'
          children={loading ? <Spinner /> : <SearchIcon />}
        />
      </InputGroup>

      {isFocus && <SuggestList results={results} />}
    </Box>
  );
}
