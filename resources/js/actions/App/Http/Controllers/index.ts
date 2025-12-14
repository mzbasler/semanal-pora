import DashboardController from './DashboardController'
import StandingsController from './StandingsController'
import FootballMatchController from './FootballMatchController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
StandingsController: Object.assign(StandingsController, StandingsController),
FootballMatchController: Object.assign(FootballMatchController, FootballMatchController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers