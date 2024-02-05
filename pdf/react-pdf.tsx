import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  render,
	PDFViewer
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { flexDirection: "row", backgroundColor: "white" },
  section: { margin: 10, padding: 10, flexGrow: 1 }
});
const Doc = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{data?.content || "gu"}</Text>
      </View>
    </Page>
  </Document>
);

const PDF = ({ data }) => {
  // render(<Doc data={data} />, `${__dirname}/example.pdf`);
	// return <PDFViewer><Doc data={data} /></PDFViewer>
	return <span>hi</span>
};
export default PDF;
