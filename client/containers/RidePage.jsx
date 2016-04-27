import React, { PropTypes, Component } from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import { FormattedNumber } from "react-intl";

import { getRideById } from "../actions/ride";
import { getUsersOnCurrentRide } from "../selectors/user";
import { getCurrentRide } from "../selectors/ride";
import { getChapterForCurrentRide } from "../selectors/chapter";

import RideRegistration from "./RideRegistration";
import RidersList from "../components/RidersList";
import Timestamp from "../components/Timestamp";
import Spinner from "../components/Spinner";

function mapStateToProps(state) {
  return {
    ride: getCurrentRide(state),
    chapter: getChapterForCurrentRide(state),
    riders: getUsersOnCurrentRide(state)
  }
}

@connect(mapStateToProps)
export default class RidePage extends Component {
  static propTypes = {
    ride: PropTypes.object,
    chapter: PropTypes.object,
    riders: PropTypes.arrayOf(PropTypes.object)
  };

  componentWillMount() {
    const { dispatch, params } = this.props;
    dispatch(getRideById(params.id));
  }

  render() {
    const { ride, chapter, riders } = this.props;

    if (!ride) {
      return <Spinner message="loading ride details" />;
    } else {
      return (
        <DocumentTitle title={ride.name + " - Techbikers"}>
          <div id="ride">
            <section id="header">
              <header>
                <h1>{ride.name}</h1>
                <h3>
                  <Timestamp value={ride.start_date} format="D MMM" /> to <Timestamp value={ride.end_date} format="D MMM YYYY" />
                </h3>
                <h3>Part of the <Link to={`/chapters/${chapter.name.toLowerCase()}`} >{chapter.name}</Link> chapter</h3>
              </header>

              <div className="content">
                <h2>We've raised <FormattedNumber style="currency" currency={ride.currency} value={ride.fundraising_total} maximumFractionDigits={0} />!</h2>
              </div>
            </section>

            <RideRegistration />

            <RidersList riders={riders} />

            <section id="description">
              <div className="content" dangerouslySetInnerHTML={{__html: ride.description_html}}>
              </div>
            </section>
          </div>
        </DocumentTitle>
      );
    }
  }
}