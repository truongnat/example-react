import React from 'react';
import { Button, FormLabel, useToast } from '@chakra-ui/react';
import { uploadFileFirebase } from '../utils';
import { useSelector } from 'react-redux';
import { userSelector } from '../redux/selector';

export default function SingleUploadFile({ onComplete }) {
  const dataUser = useSelector(userSelector);
  const toast = useToast();
  const onChangeFile = async (e) => {
    if (!e.target.files || (e.target.files && !e.target.files.length)) {
      toast({
        title: 'Error load file',
        description: 'Something went wrong load file!',
        status: 'error',
        duration: 3000,
        isClosable: true,
        variant: 'left-accent',
        position: 'top',
      });
    }
    let imgFile = e.target.files[0];
    console.log('loging img file : ', imgFile);
    let validFile = imgFile.type !== ['image/png', 'image/jpeg'];
    if (validFile) {
      toast({
        title: 'Valid file',
        description: 'File includes .png | .jpg !',
        status: 'error',
        duration: 3000,
        isClosable: true,
        variant: 'left-accent',
        position: 'top',
      });
      return;
    }
    const link = await uploadFileFirebase(dataUser.user._id, imgFile);
    onComplete(link);
  };
  return (
    <div className={'w-full'}>
      <Button as={FormLabel} htmlFor='upload' className='w-full'>
        Change Avatar
      </Button>
      <input
        type={'file'}
        id='upload'
        hidden
        onChange={onChangeFile}
        value={''}
      />
    </div>
  );
}
