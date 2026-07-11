import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'

const BookHome = lazy(() => import('@/pages/book/BookHome'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const PaperEncyclopedia = lazy(() => import('@/pages/book/PaperEncyclopedia'))
const BindingSelector = lazy(() => import('@/pages/book/BindingSelector'))
const ProcessLibrary = lazy(() => import('@/pages/book/ProcessLibrary'))
const ConflictDetector = lazy(() => import('@/pages/book/ConflictDetector'))
const CoverDesigner = lazy(() => import('@/pages/book/CoverDesigner'))
const LayoutAssistant = lazy(() => import('@/pages/book/LayoutAssistant'))
const BookAccessories = lazy(() => import('@/pages/book/BookAccessories'))
const Book3DPreview = lazy(() => import('@/pages/book/Book3DPreview'))
const FontLibrary = lazy(() => import('@/pages/book/FontLibrary'))
const BindingAccessories = lazy(() => import('@/pages/book/BindingAccessories'))
const GoodsHome = lazy(() => import('@/pages/goods/GoodsHome'))
const GoodsProcessLibrary = lazy(() => import('@/pages/goods/GoodsProcessLibrary'))
const GoodsRenderer = lazy(() => import('@/pages/goods/GoodsRenderer'))
const GoodsSelector = lazy(() => import('@/pages/goods/GoodsSelector'))
const GoodsCalculator = lazy(() => import('@/pages/goods/GoodsCalculator'))
const PromoHome = lazy(() => import('@/pages/promo/PromoHome'))
const EventCalendar = lazy(() => import('@/pages/promo/EventCalendar'))
const BoothDesigner = lazy(() => import('@/pages/promo/BoothDesigner'))
const PromoMaterialLibrary = lazy(() => import('@/pages/promo/PromoMaterialLibrary'))
const SocialStrategy = lazy(() => import('@/pages/promo/SocialStrategy'))
const PromoGenerator = lazy(() => import('@/pages/promo/PromoGenerator'))
const CostHome = lazy(() => import('@/pages/cost/CostHome'))
const FactoriesHome = lazy(() => import('@/pages/factories/FactoriesHome'))
const FactoryCompare = lazy(() => import('@/pages/factories/FactoryCompare'))
const InquiryHelper = lazy(() => import('@/pages/factories/InquiryHelper'))
const MarketHome = lazy(() => import('@/pages/market/MarketHome'))
const GuideHome = lazy(() => import('@/pages/guide/GuideHome'))
const ResourcesHome = lazy(() => import('@/pages/resources/ResourcesHome'))
const GlossaryPage = lazy(() => import('@/pages/resources/GlossaryPage'))
const ColorKnowledgePage = lazy(() => import('@/pages/resources/ColorKnowledgePage'))
const MistakesPage = lazy(() => import('@/pages/resources/MistakesPage'))
const ChecklistPage = lazy(() => import('@/pages/resources/ChecklistPage'))
const BeginnerGuidePage = lazy(() => import('@/pages/resources/BeginnerGuidePage'))
const CopyrightPage = lazy(() => import('@/pages/resources/CopyrightPage'))
const ProofGuidePage = lazy(() => import('@/pages/resources/ProofGuidePage'))
const PaperFeelPage = lazy(() => import('@/pages/resources/PaperFeelPage'))
const FontsResourcePage = lazy(() => import('@/pages/resources/FontsResourcePage'))
const CaseStudyPage = lazy(() => import('@/pages/resources/CaseStudyPage'))
const ToolsPage = lazy(() => import('@/pages/resources/ToolsPage'))
const ProjectHome = lazy(() => import('@/pages/project/ProjectHome'))
const ProgressBoard = lazy(() => import('@/pages/project/ProgressBoard'))
const ExportPage = lazy(() => import('@/pages/ExportPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'book', element: <BookHome /> },
      { path: 'book/paper', element: <PaperEncyclopedia /> },
      { path: 'book/binding', element: <BindingSelector /> },
      { path: 'book/crafts', element: <ProcessLibrary /> },
      { path: 'book/conflict', element: <ConflictDetector /> },
      { path: 'book/cover', element: <CoverDesigner /> },
      { path: 'book/layout', element: <LayoutAssistant /> },
      { path: 'book/accessories', element: <BookAccessories /> },
      { path: 'book/3d', element: <Book3DPreview /> },
      { path: 'book/fonts', element: <FontLibrary /> },
      { path: 'book/binding-acc', element: <BindingAccessories /> },
      { path: 'goods', element: <GoodsHome /> },
      { path: 'goods/processes', element: <GoodsProcessLibrary /> },
      { path: 'goods/renderer', element: <GoodsRenderer /> },
      { path: 'goods/selector', element: <GoodsSelector /> },
      { path: 'goods/calculator', element: <GoodsCalculator /> },
      { path: 'promo', element: <PromoHome /> },
      { path: 'promo/calendar', element: <EventCalendar /> },
      { path: 'promo/booth', element: <BoothDesigner /> },
      { path: 'promo/materials', element: <PromoMaterialLibrary /> },
      { path: 'promo/social', element: <SocialStrategy /> },
      { path: 'promo/generator', element: <PromoGenerator /> },
      { path: 'cost', element: <CostHome /> },
      { path: 'factories', element: <FactoriesHome /> },
      { path: 'factories/compare', element: <FactoryCompare /> },
      { path: 'factories/inquiry', element: <InquiryHelper /> },
      { path: 'market', element: <MarketHome /> },
      { path: 'guide', element: <GuideHome /> },
      { path: 'resources', element: <ResourcesHome /> },
      { path: 'resources/glossary', element: <GlossaryPage /> },
      { path: 'resources/color', element: <ColorKnowledgePage /> },
      { path: 'resources/mistakes', element: <MistakesPage /> },
      { path: 'resources/checklist', element: <ChecklistPage /> },
      { path: 'resources/beginner', element: <BeginnerGuidePage /> },
      { path: 'resources/copyright', element: <CopyrightPage /> },
      { path: 'resources/proof', element: <ProofGuidePage /> },
      { path: 'resources/paper-feel', element: <PaperFeelPage /> },
      { path: 'resources/fonts', element: <FontsResourcePage /> },
      { path: 'resources/cases', element: <CaseStudyPage /> },
      { path: 'resources/tools', element: <ToolsPage /> },
      { path: 'project', element: <ProjectHome /> },
      { path: 'project/board', element: <ProgressBoard /> },
      { path: 'export', element: <ExportPage /> },
    ],
  },
], {
  basename: '/Loophole-Utopia',
})