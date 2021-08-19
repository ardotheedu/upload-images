import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();
  async function createFile() {
    let response = await fetch(localImageUrl);
    let data = await response.blob();
    let metadata = {
      type: 'image/jpeg'
    };
    const file = new File([data], "test.jpg", metadata);
    return file;
  }


  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: true,
        validate: {
          isLessThan: async (imageValid) => {
            if (localImageUrl.length > 0) {
              const file = await createFile();
              if (file.size > 10485760) {
                return false;
              }
                return true;
              }
            },
          acceptedFormats: async (typeValid) => {
            const file = await createFile();
            if ( file.type.match(/\.(jpg|png|gif)\b/))
              return true;
            return false;
          }
        }
    },
    title: {
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      required: true,
      minLength: 2,
      maxLength: 20,
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    function mutationFn(variables) {
        return api.post('/api/images', variables);
        // TEMMMMMMMMMMMM QUE AJEITAR PARA RECEBER OS DADOS
    },
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.'
        })
      };

      // TODO EXECUTE ASYNC MUTATION
      mutation.mutateAsync();
      // TODO SHOW SUCCESS TOAST
      if (imageUrl) {
        toast({
          title: 'Imagem cadastrada',
          description: 'Sua imagem foi cadastrada com sucesso.'
        })
      };
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.'
      })
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      setImageUrl('');
      setLocalImageUrl('');
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          // TODO SEND IMAGE ERRORS
          error={errors.image}
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          // TODO SEND TITLE ERRORS
          error={errors.title}
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          // TODO SEND DESCRIPTION ERRORS
          error={errors.description}
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
