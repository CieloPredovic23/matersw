import { Box, Breadcrumb, BreadcrumbLink, Button, Text, useResponsive } from '@bitrise/bitkit';
import useFeatureFlag from '../hooks/useFeatureFlag';

type Props = {
  appName: string;
  appPath: string;
  workspacePath: string;
  workflowsAndPipelinesPath: string;
  onSaveClick: () => void;
  isSaveDisabled: boolean;
  isSaveInProgress: boolean;
  onDiscardClick: () => void;
  isDiscardDisabled: boolean;
};

const Header = ({
  appName = 'App Name',
  appPath = '/app',
  workspacePath = '/workspace',
  workflowsAndPipelinesPath = '/workflows-and-pipelines',
  onSaveClick,
  isSaveDisabled,
  isSaveInProgress,
  onDiscardClick,
  isDiscardDisabled,
}: Props) => {
  const { isMobile } = useResponsive();
  const enableAppDetailsSidebar = useFeatureFlag('enable-app-details-sidebar');

  const isBreadcrumbVisible =
    appName && appPath && workspacePath && (workflowsAndPipelinesPath || enableAppDetailsSidebar);

  return (
    <Box
      as="header"
      display="flex"
      flexDir={['column', 'row']}
      alignItems={['flex-start', 'center']}
      justifyContent={isBreadcrumbVisible ? 'space-between' : 'flex-end'}
      gap="16"
      borderBottom="1px solid"
      borderColor="separator.primary"
      paddingInline={32}
      paddingBlock={24}
    >
      {isBreadcrumbVisible &&
        (isMobile ? (
          <>
            {enableAppDetailsSidebar ? (
              <BreadcrumbLink href={appPath}>{appName}</BreadcrumbLink>
            ) : (
              <Breadcrumb hasSeparatorBeforeFirst>
                <BreadcrumbLink href={workflowsAndPipelinesPath}>Workflows & Pipelines</BreadcrumbLink>
              </Breadcrumb>
            )}
          </>
        ) : (
          <Breadcrumb>
            <BreadcrumbLink href={workspacePath}>Bitrise CI</BreadcrumbLink>
            <BreadcrumbLink href={appPath}>{appName}</BreadcrumbLink>
            {!enableAppDetailsSidebar && (
              <BreadcrumbLink href={workflowsAndPipelinesPath}>Workflows & Pipelines</BreadcrumbLink>
            )}
            <BreadcrumbLink isCurrentPage>
              <Text id="away" textStyle="body/lg/semibold">
                Workflow Editor
              </Text>
            </BreadcrumbLink>
          </Breadcrumb>
        ))}

      <Box
        display="flex"
        flexDir={['column', 'row']}
        gap={[8, 16]}
        alignSelf={['stretch', 'flex-end']}
        justifyContent="stretch"
      >
        <Button
          isDanger
          size="sm"
          className="discard"
          variant="secondary"
          onClick={onDiscardClick}
          isDisabled={isDiscardDisabled}
        >
          Discard
        </Button>
        <Button
          size="sm"
          className="save"
          variant="primary"
          onClick={onSaveClick}
          isDisabled={isSaveDisabled}
          isLoading={isSaveInProgress}
        >
          Save changes
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
