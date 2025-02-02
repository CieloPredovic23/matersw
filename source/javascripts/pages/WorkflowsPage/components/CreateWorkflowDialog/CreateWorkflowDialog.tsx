import { Box, Button, Dialog, DialogBody, DialogFooter, Input, Select, useDisclosure } from '@bitrise/bitkit';
import { UseDisclosureProps } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import useWorkflowIds from '../../hooks/useWorkflowIds';
import { isNotEmpty, isUnique, WORKFLOW_NAME_PATTERN, WORKFLOW_NAME_REQUIRED } from '@/models/Workflow';
import BitriseYmlProvider from '@/contexts/BitriseYmlProvider';
import { BitriseYml } from '@/models/BitriseYml';

type FormValues = {
  name: string;
  basedOn: string;
};

type Props = UseDisclosureProps & {
  basedOn?: string;
  onCreate: (data: FormValues) => void;
};

const CreateWorkflowDialog = ({ onCreate, ...disclosureProps }: Props) => {
  const { isOpen, onClose } = useDisclosure(disclosureProps);
  const workflowIds = useWorkflowIds();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      basedOn: '',
    },
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleCreate = handleSubmit((formData) => {
    onCreate(formData);
    onClose();
    reset();
  });

  return (
    <Dialog title="Create Workflow" isOpen={isOpen} onClose={handleClose}>
      <DialogBody>
        <Box as="form" display="flex" flexDir="column" gap="24">
          <Input
            isRequired
            label="Name"
            placeholder="Workflow name"
            errorText={errors.name?.message}
            {...register('name', {
              required: WORKFLOW_NAME_REQUIRED,
              pattern: WORKFLOW_NAME_PATTERN,
              validate: { isUnique: isUnique(workflowIds), isNotEmpty },
            })}
          />
          <Select isRequired defaultValue="" label="Based on" {...register('basedOn')}>
            <option key="" value="">
              An empty workflow
            </option>
            {workflowIds.map((wfName) => (
              <option key={wfName} value={wfName}>
                {wfName}
              </option>
            ))}
          </Select>
        </Box>
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleCreate}>
          Create Workflow
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

// TODO: Remove this after the whole page gets the BitriseYmlProvider
const CreateWorkflowDialogWrapper = ({ yml, ...props }: Props & { yml: BitriseYml }) => {
  return (
    <BitriseYmlProvider yml={yml}>
      <CreateWorkflowDialog {...props} />
    </BitriseYmlProvider>
  );
};

export default CreateWorkflowDialogWrapper;
