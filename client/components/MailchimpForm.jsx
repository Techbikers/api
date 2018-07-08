import React from "react"

const MailchimpForm = () => (
  <section id="mailchimp" style={{ background: "#4494c7", padding: 15, marginTop: 40, borderRadius: 10, color: "white" }}>
    <header style={{ margin: 0 }}>
      <h1>Learn more about our plans for 2018!</h1>
    </header>

    <form
      action="//techbikers.us7.list-manage.com/subscribe/post?u=b99427a37520d53bd953e6e7c&amp;id=85462469df"
      method="post"
      name="mc-embedded-subscribe-form"
      target="_blank"
      className="centerText"
    >
      <div>
      	<input type="email" name="EMAIL" placeholder="Your email address" style={{
            fontSize: 24,
            height: 42,
            lineHeight: 42,
            width: "70%",
            border: "none"
          }} />
      </div>

      <div style={{ position: "absolute", left: "-5000px" }}>
        <input type="text" name="b_b99427a37520d53bd953e6e7c_85462469df" tabIndex="-1" value="" />
      </div>

      <div>
        <input type="submit" value="Subscribe" name="subscribe" className="btn btn-green" />
      </div>
    </form>
  </section>
)

export default MailchimpForm
