import { gql } from '@apollo/client';

const GET_PROJECTS =  gql`{
  allProjects{
    items {
      id
      title
    }
  }
}`;

export {
   GET_PROJECTS
}
