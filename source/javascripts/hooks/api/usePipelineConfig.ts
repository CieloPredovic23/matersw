import { useMutation } from '@tanstack/react-query';

type Props = {
  appSlug: string;
};

export const useUpdatePipelineConfig = ({ appSlug }: Props) => {
  return useMutation({
    mutationKey: ['app', appSlug, 'pipelineConfig'],
    mutationFn: () => updatePipelineConfig({ appSlug }),
  });
};
