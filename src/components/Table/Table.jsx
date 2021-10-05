import React from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import "./Table.css";

function Table({problemlist, problemcheckwrapper, lastelement, showtags}) {

    return (
        <div className="table-container">
            {problemlist && problemlist.length===0
            ?
                <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                    <p>
                        <Skeleton count={37} />
                    </p>
                </SkeletonTheme>
            :
                <table className="table">
                    <thead className="table-head">
                        <tr>
                            <th scope="col">Solved</th>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problemlist && problemlist.map((problem,index)=>{
                            if(problemlist.length===index+1){
                                return (
                                    <tr key={index+1} ref={lastelement}>
                                        <td className="solved">
                                            <input type="checkbox" 
                                            checked={problem.issolved}
                                            onChange={()=>{
                                                problemcheckwrapper(problem._id);
                                            }}
                                            />
                                        </td>
                                        <th scope="row">{index+1}</th>
                                        <td className="td-title">
                                            <Link to={{pathname: (problem.link)}} target="_blank">
                                                <div data-tip="React-tooltip" data-for={`element${index+1}`}>
                                                    {problem.name}
                                                </div>
                                            </Link>
                                            {showtags && (
                                                <ReactTooltip place="top" id={`element${index+1}`} type="dark" effect="float">
                                                    <span>Tags: {problem.tags.map((tag_el, tagelindex)=>(
                                                        <div key={tagelindex}>{tag_el}</div>
                                                    ))}</span>
                                                </ReactTooltip>
                                            )}
                                        </td>
                                        <td>{problem.level}</td>
                                    </tr>
                                )
                            }else{
                                return (
                                    <tr key={index+1}>
                                        <td className="solved">
                                            <input type="checkbox" 
                                            checked={problem.issolved}
                                            onChange={()=>{
                                                problemcheckwrapper(problem._id);
                                            }}
                                            />
                                        </td>
                                        <th scope="row">{index+1}</th>
                                        <td className="td-title">
                                            <Link to={{pathname: (problem.link)}} target="_blank">
                                                <div data-tip="React-tooltip" data-for={`problem${index+1}`}>
                                                    {problem.name}
                                                </div>
                                            </Link>
                                            {showtags && (
                                                <ReactTooltip place="top" id={`problem${index+1}`} type="dark" effect="float">
                                                    <span>Tags: {problem.tags.map((tag_el, tagelindex)=>(
                                                        <div key={tagelindex}>{tag_el}</div>
                                                    ))}</span>
                                                </ReactTooltip>
                                            )}
                                        </td>
                                        <td>{problem.level}</td>
                                    </tr>
                                )
                            }
                        })}
                        
                    </tbody>
                </table>
            }
        </div>
    )
}



export default Table;
