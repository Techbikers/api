import React from "react";

const CharityPage = () => (
  <section>
    <header>
      <h1>The Charity</h1>
    </header>
    <div className="content">
      <p>
        We have chosen to partner with the <a href="http://www.roomtoread.org" title="Room to Read" target="_blank">Room to Read</a>
        organisation, a not for profit that strives for a world in which all children can pursue a quality education, reach their
        full potential and contribute to their community and the world.
      </p>

      <blockquote>
        “Over seven million children have benefited from Room to Read’s programs over the past ten years.”
      </blockquote>

      <p>
        To achieve this goal, they focus on two areas for the greatest impact: literacy and gender equality in education.
        They work in collaboration with communities and local governments across Asia and Africa to develop literacy skills
        and a habit of reading among primary school children, and support girls to complete secondary school with the life
        skills they’ll need to succeed in school and beyond.
      </p>

      <p style={{padding: "0 80px"}}>
        <iframe width="480" height="360" src="//www.youtube.com/embed/9yMEIqyR3E8?rel=0" frameBorder="0" allowFullScreen></iframe>
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