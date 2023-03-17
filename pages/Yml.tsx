import data from "../source/strings.json";

export async function getStaticProps() {
  return {
    props: {
      data: data.strings.yml.warn.title
    }
  };
}

const Yml = ({ data }: { data: string }) => {
  console.log("hello logged");
  console.log(data);
  return (
    <div className="tab-yml menu-content-padding" ng-controller="YMLController as ymlCtrl">
      <section className="cardo warn" ng-if="appService.validationWarnings.length!=0">
        <div className="icon">
        </div>
          <div className="message">
          <div className="title">{data}</div>
          <ul>
            <li ng-bind="warning" ng-repeat="warning in appService.validationWarnings"></li>
          </ul>
        </div>
      </section>
      <section ng-if="ymlCtrl.shouldShowYmlStorageSettings">
        <r-yml-storage-settings 
          app-slug="ymlCtrl.appSlug"
          on-uses-repository-yml-change-saved="ymlCtrl.onUsesRepositoryYmlChangeSaved"
          uses-repository-yml="ymlCtrl.usesRepositoryYml"
        >
        </r-yml-storage-settings>
      </section>
      <section className="cardo">
        <r-yml-editor-header url="ymlCtrl.downloadAppConfigYMLPath()" uses-repository-yml="ymlCtrl.usesRepositoryYml">
        </r-yml-editor-header>
        <p className="notification no-icon" ng-if="ymlCtrl.downloadAppConfigYMLPath()"></p>
        <article>
          <div id="code-container">
          </div>
        </article>
      </section>
    </div>
  )
}

export default Yml;
