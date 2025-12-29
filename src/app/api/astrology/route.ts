import { NextRequest, NextResponse } from 'next/server'
import * as AstrologyAPI from '@/lib/astrologyApi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (!action || !data) {
      return NextResponse.json({ error: 'Action and data are required' }, { status: 400 })
    }

    let result

    switch (action) {
      // Basic Astro
      case 'birth_details':
        result = await AstrologyAPI.getBirthDetails(data)
        break
      case 'astro_details':
        result = await AstrologyAPI.getAstroDetails(data)
        break
      case 'planets':
        result = await AstrologyAPI.getPlanets(data)
        break
      case 'planets_extended':
        result = await AstrologyAPI.getPlanetsExtended(data)
        break
      case 'vedic_horoscope':
        result = await AstrologyAPI.getVedicHoroscope(data)
        break
      case 'full_kundli':
        result = await AstrologyAPI.getFullKundli(data)
        break

      // Charts
      case 'horo_chart':
        result = await AstrologyAPI.getHoroChart(data, data.chartId || 'D1')
        break
      case 'horo_chart_image':
        result = await AstrologyAPI.getHoroChartImage(data, data.chartId || 'D1')
        break

      // Doshas
      case 'manglik':
        result = await AstrologyAPI.getManglikDetails(data)
        break
      case 'kalsarpa':
        result = await AstrologyAPI.getKalSarpaDetails(data)
        break
      case 'sadhesati':
        result = await AstrologyAPI.getSadheSatiStatus(data)
        break
      case 'pitra_dosha':
        result = await AstrologyAPI.getPitraDosha(data)
        break

      // Dasha
      case 'current_dasha':
        result = await AstrologyAPI.getCurrentVDashaAll(data)
        break
      case 'major_dasha':
        result = await AstrologyAPI.getMajorVDasha(data)
        break
      case 'yogini_dasha':
        result = await AstrologyAPI.getCurrentYoginiDasha(data)
        break

      // Match Making
      case 'match_ashtakoot':
        result = await AstrologyAPI.getMatchAshtakootPoints(data)
        break
      case 'match_report':
        result = await AstrologyAPI.getMatchMakingReport(data)
        break
      case 'match_detailed':
        result = await AstrologyAPI.getMatchMakingDetailedReport(data)
        break
      case 'match_percentage':
        result = await AstrologyAPI.getMatchPercentage(data)
        break

      // Panchang
      case 'basic_panchang':
        result = await AstrologyAPI.getBasicPanchang(data)
        break
      case 'advanced_panchang':
        result = await AstrologyAPI.getAdvancedPanchang(data)
        break
      case 'chaughadiya':
        result = await AstrologyAPI.getChaughadiyaMuhurta(data)
        break
      case 'hora':
        result = await AstrologyAPI.getHoraMuhurta(data)
        break

      // Numerology
      case 'numero_table':
        result = await AstrologyAPI.getNumeroTable(data)
        break
      case 'numero_report':
        result = await AstrologyAPI.getNumeroReport(data)
        break

      // Lal Kitab
      case 'lalkitab_horoscope':
        result = await AstrologyAPI.getLalKitabHoroscope(data)
        break
      case 'lalkitab_debts':
        result = await AstrologyAPI.getLalKitabDebts(data)
        break
      case 'lalkitab_planets':
        result = await AstrologyAPI.getLalKitabPlanets(data)
        break

      // Suggestions
      case 'gem_suggestion':
        result = await AstrologyAPI.getGemSuggestion(data)
        break
      case 'rudraksha':
        result = await AstrologyAPI.getRudrakshaSuggestion(data)
        break
      case 'puja_suggestion':
        result = await AstrologyAPI.getPujaSuggestion(data)
        break

      // Reports
      case 'ascendant_report':
        result = await AstrologyAPI.getGeneralAscendantReport(data)
        break
      case 'nakshatra_report':
        result = await AstrologyAPI.getGeneralNakshatraReport(data)
        break
      case 'daily_nakshatra':
        result = await AstrologyAPI.getDailyNakshatraPrediction(data)
        break

      // Geo
      case 'geo_details':
        result = await AstrologyAPI.getGeoDetails(data.place, data.maxRows)
        break

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error('Astrology API error:', error)

    // Provide user-friendly error messages
    let errorMessage = error.message || 'Failed to fetch astrology data'
    let statusCode = 500

    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      errorMessage = 'The astrology service is temporarily busy. Please wait 30 seconds and try again.'
      statusCode = 429
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        retryable: statusCode === 429
      },
      { status: statusCode }
    )
  }
}
