import { Avatar, Box, Card, Skeleton, SkeletonBox, Text } from '@bitrise/bitkit';
import useStep from '@/hooks/useStep';
import StepService from '@/core/StepService';

type StepCardProps = {
  workflowId: string;
  stepIndex: number;
  onClick?: VoidFunction;
  showSecondary?: boolean;
};

const StepCard = ({ workflowId, stepIndex, showSecondary = true, onClick }: StepCardProps) => {
  const stepInfo = useStep(workflowId, stepIndex);

  if (!stepInfo) {
    return null;
  }

  const { isLoading, step } = stepInfo;

  if (isLoading) {
    return (
      <Card variant="outline" p="8" borderRadius="4">
        <Skeleton isActive display="flex" gap="4">
          <SkeletonBox height="32" width="32" />
          <Box display="flex" flexDir="column" gap="4">
            <SkeletonBox height="14" width="250px" />
            {showSecondary && <SkeletonBox height="14" width="100px" />}
          </Box>
        </Skeleton>
      </Card>
    );
  }

  const content = (
    <>
      <Avatar
        size="32"
        src={StepService.resolveIcon(step?.info)}
        variant="step"
        outline="1px solid"
        name={StepService.resolveName(step?.title, step?.info)}
        outlineColor="border/minimal"
      />
      <Box minW={0} textAlign="left">
        <Text textStyle="body/sm/regular" hasEllipsis>
          {step?.title}
        </Text>
        {showSecondary && (
          <Text textStyle="body/sm/regular" color="text/secondary" hasEllipsis>
            {step?.versionInfo?.selectedVersion || 'Always latest'}
          </Text>
        )}
      </Box>
    </>
  );

  if (onClick) {
    return (
      <Card variant="outline" display="flex" gap="8" p="8" borderRadius="4" as="button" onClick={onClick} withHover>
        {content}
      </Card>
    );
  }

  return (
    <Card variant="outline" display="flex" gap="8" p="8" borderRadius="4">
      {content}
    </Card>
  );
};

export default StepCard;
