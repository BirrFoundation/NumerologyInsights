import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import type { NumerologyResult, CompatibilityResult } from "@shared/schema";
import { format } from "date-fns";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#444444',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666666',
  },
  listItem: {
    fontSize: 12,
    marginBottom: 3,
    marginLeft: 20,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#666666',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#666666',
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 30,
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
});

interface Props {
  result: NumerologyResult;
  compatibility?: CompatibilityResult;
}

export function NumerologyPDFReport({ result, compatibility }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.header}>Numerology Reading Report</Text>
          <Text style={styles.text}>Name: {result.name}</Text>
          <Text style={styles.text}>Date of Birth: {format(new Date(result.birthdate), 'MMMM d, yyyy')}</Text>
          <Text style={styles.text}>Report Generated: {format(new Date(), 'MMMM d, yyyy')}</Text>
        </View>

        {/* Core Numbers */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Core Numbers</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Number Type</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Value</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Life Path Number</Text>
              <Text style={styles.tableCell}>{result.lifePath}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Destiny Number</Text>
              <Text style={styles.tableCell}>{result.destiny}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Heart's Desire Number</Text>
              <Text style={styles.tableCell}>{result.heartDesire}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Expression Number</Text>
              <Text style={styles.tableCell}>{result.expression}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Personality Number</Text>
              <Text style={styles.tableCell}>{result.personality}</Text>
            </View>
          </View>
        </View>

        {/* Interpretations */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Detailed Interpretations</Text>
          <Text style={styles.text}>{result.interpretations.overview}</Text>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Personal Recommendations</Text>
          <Text style={styles.text}>Strengths:</Text>
          {result.interpretations.recommendations.strengths.map((strength, index) => (
            <Text key={index} style={styles.listItem}>• {strength}</Text>
          ))}
          
          <Text style={[styles.text, { marginTop: 10 }]}>Challenges:</Text>
          {result.interpretations.recommendations.challenges.map((challenge, index) => (
            <Text key={index} style={styles.listItem}>• {challenge}</Text>
          ))}
          
          <Text style={[styles.text, { marginTop: 10 }]}>Growth Areas:</Text>
          {result.interpretations.recommendations.growthAreas.map((area, index) => (
            <Text key={index} style={styles.listItem}>• {area}</Text>
          ))}
          
          <Text style={[styles.text, { marginTop: 10 }]}>Recommended Practices:</Text>
          {result.interpretations.recommendations.practices.map((practice, index) => (
            <Text key={index} style={styles.listItem}>• {practice}</Text>
          ))}
        </View>

        {/* Compatibility Analysis (if available) */}
        {compatibility && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Compatibility Analysis</Text>
            <Text style={styles.text}>Overall Compatibility Score: {compatibility.score}%</Text>
            
            <Text style={[styles.text, { marginTop: 10 }]}>Key Aspects:</Text>
            {compatibility.aspects.map((aspect, index) => (
              <Text key={index} style={styles.listItem}>• {aspect}</Text>
            ))}

            <Text style={[styles.text, { marginTop: 10 }]}>Relationship Dynamics:</Text>
            {compatibility.dynamics.map((dynamic, index) => (
              <Text key={index} style={styles.listItem}>• {dynamic}</Text>
            ))}

            <Text style={[styles.text, { marginTop: 10 }]}>Growth Areas:</Text>
            {compatibility.growthAreas.map((area, index) => (
              <Text key={index} style={styles.listItem}>• {area}</Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
