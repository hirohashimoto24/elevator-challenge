export default class Elevator {
  constructor() {
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.requests = []
    this.riders = []
  }

  dispatch() {
    while (this.requests.length > 0 || this.riders.length > 0) {
      let targetFloor = null

      if (this.riders.length > 0) {
        targetFloor = this.riders[0].dropOffFloor
      } else if (this.requests.length > 0) {
        targetFloor = this.requests[0].currentFloor
      }

      if (targetFloor === null) {
        break
      }

      while (this.currentFloor < targetFloor) {
        this.moveUp()
        this.checkFloor()
      }

      while (this.currentFloor > targetFloor) {
        this.moveDown()
        this.checkFloor()
      }

      this.checkFloor()
    }

    if (this.checkReturnToLoby()) {
      this.returnToLoby()
    }
  }

  goToFloor(person) {
    this.requests.push(person)
    this.dispatch()
  }

  moveUp() {
    this.currentFloor++
    this.floorsTraversed++
  }

  moveDown() {
    if (this.currentFloor > 0) {
      this.currentFloor--
      this.floorsTraversed++
    }
  }

  hasStop() {
    return this.requests.some(request => request.currentFloor === this.currentFloor) ||
      this.riders.some(rider => rider.dropOffFloor === this.currentFloor)
  }

  hasPickup() {
    const pickups = this.requests.filter(
      request => request.currentFloor === this.currentFloor
    )

    if (pickups.length === 0) {
      return false
    }

    this.requests = this.requests.filter(
      request => request.currentFloor !== this.currentFloor
    )

    this.riders.push(...pickups)
    return true
  }

  hasDropoff() {
    const hasAnyDropoff = this.riders.some(
      rider => rider.dropOffFloor === this.currentFloor
    )

    if (!hasAnyDropoff) {
      return false
    }

    this.riders = this.riders.filter(
      rider => rider.dropOffFloor !== this.currentFloor
    )

    return true
  }

  checkFloor() {
    const shouldStop = this.hasStop()

    if (!shouldStop) {
      return false
    }

    const droppedOff = this.hasDropoff()
    const pickedUp = this.hasPickup()

    if (droppedOff || pickedUp) {
      this.stops++
      return true
    }

    return false
  }

  checkReturnToLoby() {
    return this.requests.length === 0 &&
      this.riders.length === 0 &&
      new Date().getHours() < 12
  }

  returnToLoby() {
    while (this.currentFloor > 0) {
      this.moveDown()
    }
  }

  reset() {
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.requests = []
    this.riders = []
  }
}