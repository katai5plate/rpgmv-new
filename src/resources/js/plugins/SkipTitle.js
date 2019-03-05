(() => {
    Scene_Boot.prototype.start = function () {
        Scene_Base.prototype.start.call(this);
        SoundManager.preloadImportantSounds();
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
        this.updateDocumentTitle();
    };
})()