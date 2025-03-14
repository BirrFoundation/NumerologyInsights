import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { NumerologyResult, CompatibilityResult } from "@shared/schema";
import { format } from "date-fns";

// Register a fallback font
Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf',
});

// Create styles with simpler, more compatible properties
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Open Sans',
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
    fontSize: 14,
    marginBottom: 8,
    color: '#444444',
  },
  text: {
    fontSize: 10,
    marginBottom: 4,
    color: '#666666',
  },
  listItem: {
    fontSize: 10,
    marginBottom: 2,
    marginLeft: 15,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  numberBlock: {
    width: '45%',
    padding: 8,
    marginBottom: 10,
    marginHorizontal: '2.5%',
    borderWidth: 1,
    borderColor: '#666666',
  },
  numberTitle: {
    fontSize: 10,
    color: '#444444',
    marginBottom: 4,
    textAlign: 'center',
  },
  numberValue: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 5,
    color: '#333333',
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
  const coreNumbers = [
    { title: 'Life Path Number', value: result.lifePath },
    { title: 'Destiny Number', value: result.destiny },
    { title: "Heart's Desire", value: result.heartDesire },
    { title: 'Birth Date Number', value: result.birthDateNum },
    { title: 'Personality', value: result.personality }
  ];

  const recommendations = result.recommendations || {
    strengths: [],
    challenges: [],
    growthAreas: [],
    practices: []
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.header}>Numerology Reading Report</Text>
          <Text style={styles.text}>Name: {result.name}</Text>
          <Text style={styles.text}>
            Date of Birth: {format(new Date(result.birthdate), 'MMMM d, yyyy')}
          </Text>
          <Text style={styles.text}>
            Report Generated: {format(new Date(), 'MMMM d, yyyy')}
          </Text>
        </View>

        {/* Core Numbers */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Core Numbers</Text>
          <View style={styles.numberGrid}>
            {coreNumbers.map((number, index) => (
              <View key={index} style={styles.numberBlock}>
                <Text style={styles.numberTitle}>{number.title}</Text>
                <Text style={styles.numberValue}>{number.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Personal Development Guide</Text>

          <Text style={styles.sectionTitle}>Strengths</Text>
          {recommendations.strengths.map((strength, index) => (
            <Text key={index} style={styles.listItem}>• {strength}</Text>
          ))}

          <Text style={styles.sectionTitle}>Challenges</Text>
          {recommendations.challenges.map((challenge, index) => (
            <Text key={index} style={styles.listItem}>• {challenge}</Text>
          ))}

          <Text style={styles.sectionTitle}>Growth Areas</Text>
          {recommendations.growthAreas.map((area, index) => (
            <Text key={index} style={styles.listItem}>• {area}</Text>
          ))}

          <Text style={styles.sectionTitle}>Recommended Practices</Text>
          {recommendations.practices.map((practice, index) => (
            <Text key={index} style={styles.listItem}>• {practice}</Text>
          ))}
        </View>

        <Text 
          style={styles.pageNumber} 
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
          fixed 
        />
      </Page>

      {/* Only add compatibility page if compatibility data exists */}
      {compatibility && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Compatibility Analysis</Text>
            <Text style={styles.text}>Overall Score: {compatibility.score}%</Text>

            <Text style={styles.sectionTitle}>Key Aspects</Text>
            {compatibility.aspects.map((aspect, index) => (
              <Text key={index} style={styles.listItem}>• {aspect}</Text>
            ))}

            <Text style={styles.sectionTitle}>Relationship Dynamics</Text>
            {compatibility.dynamics.map((dynamic, index) => (
              <Text key={index} style={styles.listItem}>• {dynamic}</Text>
            ))}

            <Text style={styles.sectionTitle}>Areas for Growth</Text>
            {compatibility.growthAreas.map((area, index) => (
              <Text key={index} style={styles.listItem}>• {area}</Text>
            ))}
          </View>

          <Text 
            style={styles.pageNumber} 
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
            fixed 
          />
        </Page>
      )}
    </Document>
  );
}