import React, { useState, useEffect } from "react";
import { SearchResults } from "./SearchResults";
import star from "../assets/images/star.png";
import gitLogo from "../assets/images/GitHub-Logo.png";
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
				<h1 className="text-white text-center mb-3">
					GitHub Repository Search and Bookmarking
				</h1>
				<img className="gitLogo" src={gitLogo} alt="" />
				<form className="mx-auto bg-dark rounded-2">
					<input
						type="text"
						class="form-control"
						id="repoSearch"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search Git Repository"
					/>
				</form>
				<hr></hr>
				<div className="row">
					<div className="col col-md-6 col-12 mb-5 mb-md-0">
						<h4 className="rounded bg-light-subtle p-2 mb-3 text-center">
							Search Results
						</h4>
						{totalPageCount > 0 ? (
							<>
								<div className="border rounded p-3 search-results bg-secondary-subtle">
									<SearchResults
										SearchResultsArrAY={repositories}
										handleBookmark={handleBookmark}
										bookmarkedRepositoriesArray={bookmarkedRepositories}
									/>
								</div>

								<div className="card p-3 bg-primary-subtle mt-5">
									<Pagination
										totalPageCount={totalPageCount}
										setCurrentPage={setCurrentPage}
										currentPage={currentPage}
									/>
								</div>
							</>
						) : null}
					</div>
					<div className="col col-md-6 col-12 mb-5 mb-md-0">
						<h4 className="rounded bg-light-subtle p-2 mb-3 text-center">
							Bookmarked Repositories
						</h4>
						{totalPageCount > 0 ? (
							<>
								<div className="border rounded p-3 bookmarked-results bg-secondary-subtle">
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
							</>
						) : null}
					</div>

					{/* <div className="card p-3 bg-primary-subtle col-auto mx-auto mt-5 text-center">
						Total page count for the keyword is:
						<strong>{totalPageCount}</strong>
					</div> */}
				</div>
			</div>
		</>
	);
};

export default SearchApi;
