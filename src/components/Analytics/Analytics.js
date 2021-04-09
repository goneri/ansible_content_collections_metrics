import { useState } from "react";
import RepositoryList from "./RepositoryList";
import RepositoryAnalytics from "./RepositoryAnalytics";
import { Button, Card, Drawer } from "antd";
import { REPOSITORIES } from "../../data/repositories";
import { UnorderedListOutlined } from "@ant-design/icons";
import moment from "moment";

const Analytics = () => {
  // Default repository is the first repository object in the REPOSITORIES list
  const [selectedRepository, setSelectedRepository] = useState(
    JSON.parse(localStorage.getItem("analyticsRepository")) || REPOSITORIES[0]
  );
  const repositoryCallback = (selectedRepository) => {
    setSelectedRepository(selectedRepository);
  };
  // console.log("SELECTED REPOSITORY:", selectedRepository);

  localStorage.setItem(
    "analyticsRepository",
    JSON.stringify(selectedRepository)
  );

  // *******************************************

  const MONTHS = () => {
    const noOfYears = 1;
    const noOfMonths = noOfYears * 12;

    const monthRanges = [];

    for (let month = 0; month <= noOfMonths; month++) {
      let monthStart = moment()
        .subtract(month, "months")
        .startOf("month")
        .format("YYYY-MM-DD")
        .toString();

      let monthEnd = moment()
        .subtract(month, "months")
        .endOf("month")
        .format("YYYY-MM-DD")
        .toString();

      let dateString = `${monthStart}..${monthEnd}`;

      monthRanges.push(dateString);
    }

    return monthRanges;
  };

  console.log("MONTH TEST", MONTHS());

  // *******************************************

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className="analytics">
      <Card className="repo-list">
        <RepositoryList repositoryCallback={repositoryCallback} />
      </Card>
      <div className="mobile-visible">
        <Button
          icon={<UnorderedListOutlined />}
          size="small"
          onClick={showDrawer}
        ></Button>
        <Drawer
          placement="left"
          closable={false}
          onClose={onClose}
          visible={visible}
          getContainer={false}
          drawerStyle={{ backgroundColor: "#3d5861" }}
        >
          <div className="repo-list-mobile">
            <RepositoryList
              repositoryCallback={repositoryCallback}
              drawerClose={onClose}
            />
          </div>
        </Drawer>
      </div>
      <div className="repo-analytics">
        <RepositoryAnalytics
          owner={selectedRepository.owner}
          repository={selectedRepository.repo}
        />
      </div>
    </div>
  );
};

export default Analytics;
