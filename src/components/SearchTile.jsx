import React from "react";
import star from "../assets/images/star.png";

export const SearchTile = (props) => {
	const {
		repository_name,
		repository_owner,
		repository_desc,
		repository_starCount,
		bookmarkedRepositoriesArray,
		handleBookmark,
		repository,
	} = props;
	return (
		<>
			<li className="card p-3 mb-3">
				<p>
					<strong>{repository_name}</strong> by {repository_owner}
				</p>
				<p>{repository_desc}</p>
				<strong className="d-flex align-items-center">
					Stars: <img src={star} alt="" /> {repository_starCount}
				</strong>
				<button
					type="button"
					className="w-50 mt-2 btn btn-secondary"
					onClick={() => handleBookmark(repository)}
				>
					{bookmarkedRepositoriesArray.some((item) => item.id === repository.id)
						? "Unbookmark"
						: "Bookmark"}
				</button>
			</li>
		</>
	);
};
