import { gql } from '@apollo/client';

const GET_PROJECT_WITH_SAMPLING_POINT = gql`
  query GetProjectWithSamplingPoint($id: ID) {
    samplingPoint(id: $id) {
      identifier
      project {
        id
        title
        shortname
      }
    }
  }
`;

const GET_PROJECTS = gql`{
  allProjects{
    items {
      id,
      title,
      shortname
      siteSet{
        items {
          id,
          identifier,
          samplingpointSet{
            items {
              id,
              identifier,
              dateCollected
              device {
                id,
                additionalIdentifier,
                deviceType,
                serialNumber
              }
            }
          }
        }
      }
    }
  }
}`;

export {
  GET_PROJECTS,
  GET_PROJECT_WITH_SAMPLING_POINT
}
