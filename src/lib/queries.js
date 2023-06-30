import { gql } from '@apollo/client';

const GET_PROJECTS =  gql`{
  allProjects{
    items {
      id,
      title,
      shortname,
      samplingpointSet{
        items{
          id
          identifier,
          dateCollected,
        }
      }
      siteSet{
        items {
          id,
          identifier,
          samplingpointSet{
            items {
              id,
              identifier,
              dateCollected,
            }
          }
        }
      }
    }
  }
}`;

export {
   GET_PROJECTS
}
