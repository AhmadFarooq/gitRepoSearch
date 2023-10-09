import React, { useState, useEffect } from "react";
import { SearchResults } from "./SearchResults";
import star from "../assets/images/star.png";
import Pagination from "./Pagination";

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

	return (
		<>
			<div className="container">
				<form>
					<h1>GitHub Repository Search and Bookmarking</h1>
					<div class="mb-3">
						<input
							type="text"
							class="form-control"
							id="repoSearch"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search Git Repository"
						/>
					</div>
				</form>
				<hr></hr>
				<div className="row">
					<div className="col text-start col-md-6">
						<div className="border border-3 rounded p-3">
							<h4 className="mb-3 text-center">Search Results</h4>
							<SearchResults
								SearchResultsArrAY={repositories}
								handleBookmark={handleBookmark}
								bookmarkedRepositoriesArray={bookmarkedRepositories}
							/>
						</div>
					</div>
					<div className="col col-md-6">
						<div className="border border-3 rounded p-3">
							<h4 className="mb-3 text-center">Bookmarked Repositories</h4>
							<ul>
								{bookmarkedRepositories.map((repository) => (
									<li className="card p-3 mb-3" key={repository.id}>
										<p>
											<strong>{repository.name}</strong> by
											{repository.owner.login}
										</p>
										<p>{repository.description}</p>
										<strong className="d-flex align-items-center">
											Stars: <img src={star} alt="" />{" "}
											{repository.stargazers_count}
										</strong>
										<button
											type="button"
											className="w-50 mt-2 btn btn-secondary"
											onClick={() => handleBookmark(repository)}
										>
											Unbookmark
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>
					{totalPageCount > 0 ? (
						<div className="card p-3 justify-content-center bg-primary-subtle col-auto mx-auto mt-5 text-center">
							<Pagination
								totalPageCount={totalPageCount}
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
							/>
						</div>
					) : null}
					<div className="card p-3 bg-primary-subtle col-auto mx-auto mt-5 text-center">
						Total page count for the keyword is:
						<strong>{totalPageCount}</strong>
					</div>
				</div>
			</div>
		</>
	);
};

export default SearchApi;
