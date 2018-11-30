import React from "react";
import { Query } from "react-apollo";
import { HOME_PAGE } from "./queries";
import { Card, Image, Icon, Grid } from "semantic-ui-react";

const Home = () => (
  <Grid columns={3} divided>
    <Grid.Row>
      <Query query={HOME_PAGE}>
        {({ loading, data, error }) => {
          if (loading)
            return "현 컴포넌트는 ZEIT Free 서버를 사용하므로 초기에 느릴수 있습니다.";
          if (error) return "Something Happened";

          return data.movies.map((movie, idx) => (
            <Grid.Column key={idx}>
              <Card
                image={movie.medium_cover_image}
                header={movie.title}
                description={movie.synopsis}
                extra={
                  <div>
                    <Icon name="user" />
                    {movie.year} / {movie.runtime} /{movie.rating}
                  </div>
                }
              />
            </Grid.Column>
          ));
        }}
      </Query>
    </Grid.Row>
  </Grid>
);
export default Home;
