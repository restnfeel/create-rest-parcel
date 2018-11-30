import gql from "graphql-tag";

export const HOME_PAGE = gql`
  {
    movies(limit: 50) {
      title
      rating
      medium_cover_image
      synopsis
      small_cover_image
      year
      runtime
    }
  }
`;
