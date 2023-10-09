import React from "react";
import { SearchTile } from "./SearchTile";

export const SearchResults = (props) => {
	const {
		SearchResultsArrAY = [],
		handleBookmark,
		bookmarkedRepositoriesArray,
	} = props;
	return (
		<>
			<ul>
				{SearchResultsArrAY.map((repository) => (
					<SearchTile
						key={repository.id}
						repository_name={repository.name}
						repository_owner={repository.owner.login}
						repository_desc={repository.description}
						repository_starCount={repository.stargazers_count}
						bookmarkedRepositoriesArray={bookmarkedRepositoriesArray}
						handleBookmark={handleBookmark}
						repository={repository}
					/>
				))}
			</ul>
		</>
	);
};
