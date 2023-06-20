import { gql } from '@apollo/client';

const GET_PROJECTS =  gql`{
  allProjects{
    items {
      id
      title,
      samplingPointArea{
        items{
          id
        }
      }
    }
  }
}`;

export {
   GET_PROJECTS
}
