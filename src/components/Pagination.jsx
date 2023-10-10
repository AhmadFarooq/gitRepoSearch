import React from "react";

const Pagination = (props) => {
	const { totalPageCount, setCurrentPage, currentPage } = props;
	return (
		<>
			{totalPageCount > 1 && (
				<>
					<nav aria-label="Page navigation example">
						<ul class="pagination gap-3 align-items-center justify-content-between">
							<li class="page-item">
								<button
									className="btn btn-primary"
									onClick={() =>
										setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
									}
									disabled={currentPage === 1}
								>
									Previous
								</button>
							</li>
							<li class="page-item">
								<span>
									Page {currentPage} of {totalPageCount}
								</span>
							</li>
							<li class="page-item">
								<button
									className="btn btn-primary"
									onClick={() =>
										setCurrentPage((prevPage) =>
											Math.min(prevPage + 1, totalPageCount)
										)
									}
									disabled={currentPage === totalPageCount}
								>
									Next
								</button>
							</li>
						</ul>
					</nav>
				</>
			)}
		</>
	);
};

export default Pagination;
