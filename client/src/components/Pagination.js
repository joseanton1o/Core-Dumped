import React from 'react'
// Chunk of code extracted from https://github.com/bradtraversy/simple_react_pagination
const Pagination = ({postsPerPage, totalPosts, paginate}) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }


    return (
        <nav className='pag-nav N/A transparent z-depth-0'>
          <ul className='pagination'>
            {pageNumbers.map(number => (
              <li key={number}>
                {/* https://www.youtube.com/watch?v=IYCa1F-OWmk&ab_channel=TraversyMedia changed the href of the a attributte to a button thanks to Gabriel Ramirez's comment in the video */}
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