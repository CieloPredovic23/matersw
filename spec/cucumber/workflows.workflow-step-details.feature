Feature: Workflow Step details

  The selected Step's properties can be viewed & some of them can be edited.

  Background:
    Given there is Workflows called ci
    And it has a Step
    And the Step is selected

  Scenario: Deprecated Steps have the purple badge displayed
    Given the Step is deprecated
    Then the purple deprecated badge appears next to the Step's name

  Scenario: Deprecated badges display their category in a tooltip on hover
    Given the Step is deprecated
    When User hovers the green deprecated badge
    Then the phrase Deprecated shows up in a tooltip

  Scenario: User clones Step
    When User selects the clone button on the right
    Then a duplication of the Step (along with all its modified properties) is added to the Workflow, right after the original Step
    And the new Step gets selected


  Scenario: User visits the source code of a Step having one
    Given the Step has source code URL set
    When User selects the source code button on the right
    Then the Step's GitHub repository opens in a new tab

  Scenario: Step without source code
    Given the Step does not have source code URL set
    Then there will be no source code button on the right

  Scenario: Step without description and summary
    Given the Step does not have description set
    And the Step does not have summary set
    Then there will be no description section

  Scenario: Step without description, only summary
    Given the Step does not have description set
    But it has summary
    Then the description section will contain the summary as markdown

  Scenario: User expands the description of the Step having only summary set
    Given the Step does not have description set
    But it has summary
    When User expands the description
    Then the summary will be visible as markdown

  Scenario: Step with description, without summary
    Given the Step has description set
    But it does not have summary
    Then the description section will contain the description as markdown oneliner

  Scenario: User expands the description of the Step having only description set
    Given the Step has description set
    But it does not have summary
    When User expands the description
    Then the description will be visible as markdown

  Scenario: Step with both description and summary
    Given the Step has description set
    And it has summary
    Then the description section will contain the summary as markdown oneliner

  Scenario: User expands the description of the Step having both description and summary set
    Given the Step has description set
    And it has summary
    When User expands the description
    Then the description will be visible as markdown

  Scenario: Green Step version indicator due to Step being on Always latest
    Given the Step has Always latest selected in the version dropdown
    Then a green circle is visible on the left of the version section

  Scenario: Green Step version indicator due to Step being on the latest version
    Given the Step has the latest version selected in the version dropdown
    Then a green circle is visible on the left of the version section

  Scenario: Red Step version indicator due to Step being on an older version
    Given the Step has an older version selected in the version dropdown
    Then a red circle is visible on the left of the version section

  Scenario: Warning message for Step from a library having an invalid version set
    Given the Step is from a library
    And its version is not in the library
    Then the Invalid version message will appear

  Scenario: User views versions of a Step from a library, in dropdown
    Given the Step is specified as a part of a library
    When User selects the dropdown
    Then an entry for Always latest, and an entry for each version will be visible

  Scenario: User selects a different version in the dropdown
    Given the Step is on the latest version
    When User selects an older version in the dropdown
    Then the circle gets updated accordingly
    And all the non-overwritten properties of the Step gets updated to that older version's
    And the Step sidebar too (along with the update Step version bubble)

  Scenario: User views versions of a Step from a git URL, in dropdown
    Given the Step is specified with a git URL
    When User selects the dropdown
    Then a single entry for the Step's version will be visible

  Scenario: There is no version section for Step with a local path
    Given the Step is from a local path
    Then there will be no version section


  Scenario: Inputs section is not displayed if Step has no Inputs
    Given the Step has no Inputs
    Then there is no Inputs section

  Scenario: Inputs section is displayed if Step has Inputs
    Given the Step has Inputs
    Then the Inputs section is visible
