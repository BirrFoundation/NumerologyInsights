import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
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
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333333',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444444',
  },
  text: {
    fontSize: 10,
    marginBottom: 4,
    color: '#666666',
    lineHeight: 1.4,
  },
  listItem: {
    fontSize: 10,
    marginBottom: 2,
    marginLeft: 15,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#666666',
    marginVertical: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#666666',
    borderBottomWidth: 0.5,
    minHeight: 25,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    padding: 4,
    fontSize: 9,
  },
  tableCellHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333333',
  },
  numberCell: {
    flex: 0.3,
    padding: 4,
    fontSize: 9,
    textAlign: 'center',
  },
  meaningCell: {
    flex: 2,
    padding: 4,
    fontSize: 9,
  },
  sectionTitle: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 8,
    color: '#444444',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: '#666666',
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

        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Overview</Text>
          <Text style={styles.text}>{result.interpretations.overview}</Text>
        </View>

        {/* Core Numbers with Detailed Analysis */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Core Numbers Analysis</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Number Type</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Value</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Meaning</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Life Path Number</Text>
              <Text style={styles.tableCell}>{result.lifePath}</Text>
              <Text style={styles.tableCell}>{result.interpretations.lifePath}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Destiny Number</Text>
              <Text style={styles.tableCell}>{result.destiny}</Text>
              <Text style={styles.tableCell}>{result.interpretations.destiny}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Heart's Desire</Text>
              <Text style={styles.tableCell}>{result.heartDesire}</Text>
              <Text style={styles.tableCell}>{result.interpretations.heartDesire}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Expression</Text>
              <Text style={styles.tableCell}>{result.expression}</Text>
              <Text style={styles.tableCell}>{result.interpretations.expression}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Personality</Text>
              <Text style={styles.tableCell}>{result.personality}</Text>
              <Text style={styles.tableCell}>{result.interpretations.personality}</Text>
            </View>
          </View>
        </View>

        {/* Detailed Recommendations */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Personal Development Guide</Text>

          <Text style={styles.sectionTitle}>Your Strengths</Text>
          {result.recommendations.strengths.map((strength, index) => (
            <Text key={index} style={styles.listItem}>• {strength}</Text>
          ))}

          <Text style={styles.sectionTitle}>Areas for Growth</Text>
          {result.recommendations.challenges.map((challenge, index) => (
            <Text key={index} style={styles.listItem}>• {challenge}</Text>
          ))}

          <Text style={styles.sectionTitle}>Development Areas</Text>
          {result.recommendations.growthAreas.map((area, index) => (
            <Text key={index} style={styles.listItem}>• {area}</Text>
          ))}

          <Text style={styles.sectionTitle}>Recommended Practices</Text>
          {result.recommendations.practices.map((practice, index) => (
            <Text key={index} style={styles.listItem}>• {practice}</Text>
          ))}
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>

      {/* Additional page for Personal Growth */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Personal Growth & Development</Text>

          <Text style={styles.subHeader}>Development Summary</Text>
          <Text style={styles.text}>{result.interpretations.developmentSummary}</Text>

          <Text style={styles.sectionTitle}>Master Number Influence</Text>
          <Text style={styles.text}>
            {[11, 22, 33].includes(result.lifePath)
              ? "Your Life Path is a powerful Master Number, indicating heightened spiritual awareness and potential."
              : "While you don't have Master Numbers in your core numbers, you can still access higher spiritual vibrations through conscious development."}
          </Text>

          <Text style={styles.sectionTitle}>Karmic Influences</Text>
          <Text style={styles.text}>
            {result.lifePath === 8
              ? "You have significant karmic influences in your numerology, suggesting important life lessons and responsibilities."
              : "Your numbers suggest a focus on personal growth through everyday experiences."}
          </Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>

      {/* Compatibility Analysis if available */}
      {compatibility && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Compatibility Analysis</Text>

            <Text style={styles.subHeader}>Overall Compatibility</Text>
            <Text style={styles.text}>Compatibility Score: {compatibility.score}%</Text>

            <Text style={styles.sectionTitle}>Key Aspects</Text>
            {compatibility.aspects.map((aspect, index) => (
              <Text key={index} style={styles.listItem}>• {aspect}</Text>
            ))}

            <Text style={styles.sectionTitle}>Life Path Harmony</Text>
            <Text style={styles.text}>Score: {compatibility.lifePathScore}%</Text>

            <Text style={styles.sectionTitle}>Expression Compatibility</Text>
            <Text style={styles.text}>Score: {compatibility.expressionScore}%</Text>

            <Text style={styles.sectionTitle}>Heart's Desire Connection</Text>
            <Text style={styles.text}>Score: {compatibility.heartDesireScore}%</Text>

            <Text style={styles.sectionTitle}>Relationship Dynamics</Text>
            {compatibility.dynamics.map((dynamic, index) => (
              <Text key={index} style={styles.listItem}>• {dynamic}</Text>
            ))}

            <Text style={styles.sectionTitle}>Areas for Growth Together</Text>
            {compatibility.growthAreas.map((area, index) => (
              <Text key={index} style={styles.listItem}>• {area}</Text>
            ))}

            {/* Relationship Type Analysis */}
            <Text style={styles.subHeader}>Relationship Type Analysis</Text>

            {Object.entries(compatibility.relationshipTypes).map(([type, data]) => (
              <View key={type}>
                <Text style={styles.sectionTitle}>{type.charAt(0).toUpperCase() + type.slice(1)} Compatibility</Text>
                <Text style={styles.text}>Score: {data.score}%</Text>
                <Text style={styles.text}>Strengths:</Text>
                {data.strengths.map((strength, index) => (
                  <Text key={index} style={styles.listItem}>• {strength}</Text>
                ))}
                <Text style={styles.text}>Challenges:</Text>
                {data.challenges.map((challenge, index) => (
                  <Text key={index} style={styles.listItem}>• {challenge}</Text>
                ))}
              </View>
            ))}
          </View>

          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
          )} fixed />
        </Page>
      )}
    </Document>
  );
}