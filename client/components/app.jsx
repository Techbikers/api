import React from "react";
import { IntlProvider } from "react-intl";
import Modal from "react-modal";

import { SEGMENT_TRACKING_KEY } from "../config";
import { modalStyles } from "../utils/modal";

import AnalyticsLoader from "./AnalyticsLoader";
import Header from "./Header";
import Footer from "./Footer";
import AuthModal from "../containers/AuthModal";

const App = ({children, modalChildren}) => (
  <IntlProvider locale="en">
    <div>
      <AnalyticsLoader segmentKey={SEGMENT_TRACKING_KEY} />
      <Header />
      {children}
      <Footer />
      <Modal isOpen={modalChildren !== null} style={modalStyles}>
        {modalChildren}
      </Modal>
    </div>
  </IntlProvider>
);

export default App;