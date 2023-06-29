import { gql } from '@apollo/client';

const UPDATE_SAMPLING_POINT = gql`
mutation UpdateSamplingPoint($id: UUID!, $dateCollected: DateTime!) {
  updateSamplingPoint(id: $id, dateCollected: $dateCollected) {
    id
    identifier
    dateCollected
    errors {
      messages
    }
  }
}

`;

export {
  UPDATE_SAMPLING_POINT
}
