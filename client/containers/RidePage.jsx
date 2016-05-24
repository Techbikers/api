import React, { PropTypes, Component } from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import { FormattedNumber } from "react-intl";

import { getRideById } from "../actions/ride";
import { updatePageMeta } from "../actions/page";
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
    const { dispatch, params, ride } = this.props;
    dispatch(getRideById(params.id));

    if (ride) {
      this.updatePageMetaForRide(ride);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, ride } = this.props;
    if (!ride && nextProps.ride) {
      this.updatePageMetaForRide(nextProps.ride);
    }
  }

  updatePageMetaForRide(ride) {
    const { dispatch } = this.props;
    dispatch(updatePageMeta({
      "og:title": `Techbikers - ${ride.name}`,
      "og:description": ride.strapline
    }));
  }

  render() {
    const { ride, chapter, riders } = this.props;

    if (!ride) {
      return <Spinner message="loading ride details" />;
    } else {
      return (
        <DocumentTitle title={ride.name + " - Techbikers"}>
          <div id="ride" itemScope itemType="http://schema.org/Event">
            <section id="header">
              <header>
                <h1 itemProp="name">{ride.name}</h1>
                <h3>
                  <Timestamp value={ride.start_date} format="D MMM" itemProp="startDate" /> to <Timestamp value={ride.end_date} format="D MMM YYYY" itemProp="endDate" />
                </h3>
                <h3>Part of the <Link to={`/chapters/${chapter.name.toLowerCase()}`} >{chapter.name}</Link> chapter</h3>
              </header>

              <div className="content">
                <h2>We've raised <FormattedNumber style="currency" currency={ride.currency} value={ride.fundraising_total} maximumFractionDigits={0} minimumFractionDigits={0} />!</h2>
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