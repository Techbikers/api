import React from "react";

const CharityPage = () => (
  <section>
    <header>
      <h1>Techbikers is proud to support <a href="http://www.roomtoread.org" title="Room to Read" target="_blank">Room to Read</a></h1>
    </header>
    <div className="content">
      <p>
        Room to Read believes that World Change Starts with Educated Children. We
        are an international nonprofit transforming the lives of millions of children
        in low-income countries across Africa and Asia by focusing on literacy and
        gender equality in education. Working in collaboration with local communities,
        partner organisations and governments, we develop literacy skills and a
        habit of reading among primary school children, and support girls to
        complete secondary school with the relevant life skills to succeed in
        school and beyond. In 2015 we reached our goal of impacting 10 million
        children. By 2020 we anticipate reaching 15 million children.
      </p>

      <p style={{ padding: "0 80px" }}>
        <iframe width="480" height="360" src="//www.youtube.com/embed/9yMEIqyR3E8?rel=0" frameBorder="0" allowFullScreen />
      </p>

      <blockquote>
        “Literacy unlocks the door to learning throughout life, is essential to development and health, and opens the way for
        democratic participation and active citizenship.”
        <br/>
        – Kofi Annan, former United Nations Secretary-General
      </blockquote>
    </div>
  </section>
);

export default CharityPage;
