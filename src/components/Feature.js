import React, { Fragment, useState } from "react";

// Don't touch this import
import { fetchQueryResultsFromTermAndValue } from "../api";

/**
 * We need a new component called Searchable which:
 *
 * Has a template like this:
 *
 * <span className="content">
 *  <a href="#" onClick={async (event) => {}}>SOME SEARCH TERM</a>
 * </span>
 *
 * You'll need to read searchTerm, searchValue, setIsLoading, and setSearchResults off of the props.
 *
 * When someone clicks the anchor tag, you should:
 *
 * - preventDefault on the event
 * - call setIsLoading, set it to true
 *
 * Then start a try/catch/finally block:
 *
 * try:
 *  - await the result of fetchQueryResultsFromTermAndValue, passing in searchTerm and searchValue
 *  - send the result to setSearchResults (which will update the Preview component)
 * catch:
 *  - console.error the error
 * finally:
 *  - call setIsLoading, set it to false
 */
const Searchable = ({
  setIsLoading,
  setSearchResults,
  searchValue,
  searchTerm,
}) => {
  return (
    <span className="content">
      <a
        href="#"
        onClick={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          try {
            const result = await fetchQueryResultsFromTermAndValue(
              searchTerm,
              searchValue
            );
            console.log(result);
            await setSearchResults(result);
          } catch (err) {
            console.error(`Search Result Error ${err} in Feature.js`);
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {searchValue}
      </a>
    </span>
  );
};

/**
 * We need a new component called Feature which looks like this when no featuredResult is passed in as a prop:
 *
 * <main id="feature"></main>
 *
 * And like this when one is:
 *
 * <main id="feature">
 *   <div className="object-feature">
 *     <header>
 *       <h3>OBJECT TITLE</h3>
 *       <h4>WHEN IT IS DATED</h4>
 *     </header>
 *     <section className="facts">
 *       <span className="title">FACT NAME</span>
 *       <span className="content">FACT VALUE</span>
 *       <span className="title">NEXT FACT NAME</span>
 *       <span className="content">NEXT FACT VALUE</span>
 *     </section>
 *     <section className="photos">
 *       <img src=IMAGE_URL alt=SOMETHING_WORTHWHILE />
 *     </section>
 *   </div>
 * </main>
 *
 * The different facts look like this: title, dated, images, primaryimageurl, description, culture, style,
 * technique, medium, dimensions, people, department, division, contact, creditline
 *
 * The <Searchable /> ones are: culture, technique, medium (first toLowerCase it), and person.displayname (one for each PEOPLE)
 *
 * NOTE: people and images are likely to be arrays, and will need to be mapped over if they exist
 *
 * This component should be exported as default.
 */
const Feature = ({ featuredResult, setIsLoading, setSearchResults }) => {
  return (
    <main id="feature">
      {featuredResult ? (
        <div className="object-feature">
          <header>
            <h3>{featuredResult.title}</h3>
            <h4>{featuredResult.dated}</h4>
          </header>

          <section className="facts">
            {featuredResult.culture ? (
              <>
                <span className="title">Culture:</span>
                <span className="content">
                  <Searchable
                    setIsLoading={setIsLoading}
                    setSearchResults={setSearchResults}
                    searchValue={featuredResult.culture}
                    searchTerm={"culture"}
                  />
                </span>
              </>
            ) : (
              ""
            )}

            {featuredResult.description ? (
              <>
                <span className="title">Description:</span>
                <span className="content">{featuredResult.description}</span>
              </>
            ) : (
              ""
            )}

            {featuredResult.medium ? (
              <>
                <span className="title">Medium:</span>
                <span className="content">
                  <Searchable
                    setIsLoading={setIsLoading}
                    setSearchResults={setSearchResults}
                    searchValue={featuredResult.medium.toLowerCase()}
                    searchTerm={"q"}
                  />
                </span>
              </>
            ) : (
              ""
            )}

            {featuredResult.people && featuredResult.people.length > 0 ? (
              <>
                <span className="title">Person/People:</span>
                <span className="content">
                  {featuredResult.people.map((el) => {
                    console.log(el);
                    return (
                      <li key={el.personid} style={{ listStyleType: "none" }}>
                        <Searchable
                          setIsLoading={setIsLoading}
                          setSearchResults={setSearchResults}
                          searchTerm={"person"}
                          searchValue={el.name}
                        />
                      </li>
                    );
                  })}
                </span>
              </>
            ) : (
              ""
            )}

            {featuredResult.department ? (
              <>
                <span className="title">Department:</span>
                <span className="content">
                  {featuredResult.department}
                </span>
              </>
            ) : (
              ""
            )}

            {featuredResult.division ? (
              <>
                <span className="title">Division:</span>
                <span className="content">{featuredResult.division} </span>
              </>
            ) : (
              ""
            )}

            {featuredResult.contact ? (
              <>
                <span className="title">Contact:</span>
                <span className="content">
                  <a target="_blank" href={`mailto:${featuredResult.contact}`}>
                    {featuredResult.contact}
                  </a>
                </span>
              </>
            ) : (
              ""
            )}

            {featuredResult.creditline ? (
              <>
                <span className="title">Credit:</span>
                <span className="content">{featuredResult.creditline}</span>
              </>
            ) : (
              ""
            )}
          </section>

          <section className="photos">
            {featuredResult.images && featuredResult.images.length > 0
              ? featuredResult.images.map((el) => {
                  return (
                    <div key={el.imageid}>
                      <img
                        src={el.baseimageurl}
                        alt={el.description}
                      />
                    </div>
                  );
                })
              : "No Image Available"}
          </section>
        </div>
      ) : (
        ""
      )}
    </main>
  );
};

export default Feature;