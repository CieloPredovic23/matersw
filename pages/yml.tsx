const Yml = (): JSX.Element => {
  return (
    <div className="tab-yml menu-content-padding" ng-controller="YMLController as ymlCtrl">
      <section className="cardo warn" ng-if="appService.validationWarnings.length!=0">
        <div className="icon"></div>
        <div className="message">
          <div className="title">
            Uups, we found some warnings in your configuration, please considere to check them.
          </div>
          <ul>
            <li ng-bind="warning" ng-repeat="warning in appService.validationWarnings"></li>
          </ul>
        </div>
      </section>
      <section ng-if="ymlCtrl.shouldShowYmlStorageSettings"><r-yml-storage-settings app-slug="ymlCtrl.appSlug"
        on-uses-repository-yml-change-saved="ymlCtrl.onUsesRepositoryYmlChangeSaved"
        uses-repository-yml="ymlCtrl.usesRepositoryYml"></r-yml-storage-settings></section>
      <section className="cardo"><r-yml-editor-header url="ymlCtrl.downloadAppConfigYMLPath()"
        uses-repository-yml="ymlCtrl.usesRepositoryYml"></r-yml-editor-header>
        <p className="notification no-icon" ng-if="ymlCtrl.downloadAppConfigYMLPath()">You can download this YML and run it
          directly with <a href='https://devcenter.bitrise.io/en/bitrise-cli.html' target='_blank' rel="noreferrer">bitrise CLI</a> locally.
        </p>
        <article>
          <div id="code-container"></div>
        </article>
      </section>
    </div>

  )
}

export default Yml;
