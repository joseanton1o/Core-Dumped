import React from 'react'
// Chunk of code extracted from https://github.com/bradtraversy/simple_react_pagination
// This is the pagination component, it will be used in the Home.js component
const Pagination = ({postsPerPage, totalPosts, paginate}) => {
    const pageNumbers = [];
    // Loop through all the posts and push the page number to the pageNumbers array
    // This basically creates an array with the page numbers using the division we know exactly how many pages we need, we also ceil the number so we don't get a decimal number, as if we need 1.5 pages we need 2 pages
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
      pageNumbers.push(i);
    }


    return (
        <nav className='pag-nav N/A transparent z-depth-0'>
          <ul className='pagination'>
            {pageNumbers.map(number => (
              <li key={number}>
                {/* https://www.youtube.com/watch?v=IYCa1F-OWmk&ab_channel=TraversyMedia changed the href of the a attributte to a button thanks to Gabriel Ramirez's comment in the video */}
                {// create a button for each page number and when it is clicked it will call the paginate function and pass the number of the page as a parameter
                }
                <button onClick={() => paginate(number)} className='pag-btn btn'>
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      );
    };


export default Pagination