import { useQuery } from "@apollo/client";
import { Button, Typography } from "antd";
import { useCallback } from "react";
import { PR } from "../../queries/collections_queries";
import DataTable from "./DataTable";
import { PR_COLUMNS } from "./PRColumns";

const ACPullRequests = ({ owner, repository }) => {
  // Query for obtaining pull requests
  const { loading, error, data, fetchMore } = useQuery(PR, {
    variables: { repositoryName: repository, ownerName: owner, cursor: null },
  });
  // console.log(data);

  const handleClick = () => {
    const { hasNextPage, endCursor } = data.repository.pullRequests.pageInfo;
    // console.log(endCursor);

    if (hasNextPage) {
      fetchMore({
        variables: { cursor: endCursor },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          // console.log("Prev Result from PR", previousResult);
          // console.log("Fetchmore Result from PR", fetchMoreResult);

          // if (!fetchMoreResult) {
          //   return previousResult;
          // }

          // return {
          //   repository: {
          //     ...previousResult.repository,
          //     pullRequests: {
          //       ...data.repository.pullRequests,
          //       edges: [
          //         ...data.repository.pullRequests.edges,
          //         ...fetchMoreResult.repository.pullRequests.edges,
          //       ],
          //     },
          //   },
          // };

          fetchMoreResult.repository.pullRequests.edges = [
            ...data.repository.pullRequests.edges,
            ...fetchMoreResult.repository.pullRequests.edges,
          ];

          return fetchMoreResult;
        },
      });
    }
  };

  const { Link } = Typography;

  return (
    <div className="ac-pull-requests">
      {error && <div>{error}</div>}
      {loading && <div>Loading...</div>}
      {console.log("PR Data", data)}
      {data && (
        <>
          <h2>Pull Requests Table</h2>
          <Button
            disabled={!data.repository.pullRequests.pageInfo.hasNextPage}
            onClick={handleClick}
          >
            Load More
          </Button>
          <DataTable
            title="Pull Requests Table"
            tag="Pull requests"
            repositoryName={data.repository.nameWithOwner}
            tableData={data.repository.pullRequests.edges}
            totalCount={data.repository.pullRequests.totalCount}
            tableColumns={PR_COLUMNS}
            tableDateRange={{
              end: data.repository.pullRequests.edges[0].node.createdAt,
              start:
                data.repository.pullRequests.edges[
                  data.repository.pullRequests.edges.length - 1
                ].node.createdAt,
            }}
          />
        </>
      )}
    </div>
  );
};
export default ACPullRequests;
