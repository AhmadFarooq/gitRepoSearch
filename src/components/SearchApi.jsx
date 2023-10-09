import React, { useState, useEffect } from "react";

const ROW_COUNT_PAGE = 10;
const DEBOUNCE_DELAY = 300; // Adjust the debounce delay as needed (in milliseconds)

const SearchApi = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [repositories, setRepositories] = useState([]);
	const [bookmarkedRepositories, setBookmarkedRepositories] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPageCount, setTotalPageCount] = useState(0);

	useEffect(() => {
		let debounceTimeout;

		// Define a function to fetch repositories
		const fetchRepositories = () => {
			if (searchQuery.trim() !== "") {
				fetch(
					`https://api.github.com/search/repositories?q=${searchQuery}&page=${currentPage}&per_page=${ROW_COUNT_PAGE}`
				)
					.then((response) => response.json())
					.then((data) => {
						console.log("data--->", data);

						const { items, total_count } = data;

						const totalNumberOfPages = Math.round(total_count / ROW_COUNT_PAGE);

						setTotalPageCount(totalNumberOfPages);
						setRepositories(items);
					})
					.catch((error) => {
						console.error("Error fetching data:", error);
					});
			} else {
				setRepositories([]);
			}
		};

		// Use debounce to delay fetching until the user stops typing
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(fetchRepositories, DEBOUNCE_DELAY);

		return () => {
			// Clean up the debounce timeout when the component unmounts or when searchQuery or currentPage changes
			clearTimeout(debounceTimeout);
		};
	}, [searchQuery, currentPage]);

	const handleBookmark = (repository) => {
		// Toggle the bookmarked status of a repository
		if (bookmarkedRepositories.some((item) => item.id === repository.id)) {
			const updatedBookmarks = bookmarkedRepositories.filter(
				(item) => item.id !== repository.id
			);
			setBookmarkedRepositories(updatedBookmarks);
		} else {
			setBookmarkedRepositories([...bookmarkedRepositories, repository]);
		}
	};

	const totalPages = Math.ceil(repositories.length / 10);

	return (
		<>
			<div className="container">
				<form>
					<h1>GitHub Repository Search and Bookmarking</h1>
					<div class="mb-3">
						<input
							type="text"
							class="form-control"
							id="exampleInputEmail1"
							aria-describedby="emailHelp"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search Git Repository"
						/>
					</div>
				</form>
				<hr></hr>
				<div className="d-flex align-items-start">
					<div>
						<h2>Search Results</h2>
						<ul>
							{repositories.map((repository) => (
								<li key={repository.id}>
									<strong>{repository.name}</strong> by {repository.owner.login}
									<p>{repository.description}</p>
									<span>Stars: {repository.stargazers_count}</span>
									<button onClick={() => handleBookmark(repository)}>
										{bookmarkedRepositories.some(
											(item) => item.id === repository.id
										)
											? "Unbookmark"
											: "Bookmark"}
									</button>
								</li>
							))}
						</ul>
						{totalPages > 1 && (
							<div>
								<button
									onClick={() =>
										setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
									}
									disabled={currentPage === 1}
								>
									Previous
								</button>
								<span>
									Page {currentPage} of {totalPages}
								</span>
								<button
									onClick={() =>
										setCurrentPage((prevPage) =>
											Math.min(prevPage + 1, totalPages)
										)
									}
									disabled={currentPage === totalPages}
								>
									Next
								</button>
							</div>
						)}
					</div>
					<div>
						<h2>Bookmarked Repositories</h2>
						<ul>
							{bookmarkedRepositories.map((repository) => (
								<li key={repository.id}>
									<strong>{repository.name}</strong> by {repository.owner.login}
									<p>{repository.description}</p>
									<span>Stars: {repository.stargazers_count}</span>
									<button onClick={() => handleBookmark(repository)}>
										Unbookmark
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			{totalPageCount}
		</>
	);
};

export default SearchApi;
