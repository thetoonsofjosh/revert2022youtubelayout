// ==UserScript==
// @name         Revert 2022 YouTube Layout
// @version      2.0.0
// @description  Changes Ugly layout to the one used before October 21, 2022
// @author       Aubrey Pankow (aubyomori@gmail.com)
// @author       Taniko Yamamoto (kirasicecreamm@gmail.com)
// @license      Unlicense
// @match        *://*.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// ==/UserScript==
// @updateURL    https://raw.githubusercontent.com/aubymori/YouTubePatchCollection/main/YouTubePatchCollection.user.js
// Attributes to remove from <html>
const ATTRS = [
    "system-icons",
    "typography",
    "typography-spacing"
];

// Regular config keys.
const CONFIGS = {
    BUTTON_REWORK: true
}

// Experiment flags.
const EXPFLAGS = {
    kevlar_system_icons: false,
    kevlar_watch_color_update: false,
    kevlar_updated_icons: false,
    enable_sasde_for_html: true,
    enable_inline_preview_controls: true,
    il_use_view_model_logging_context: true,
    live_chat_collapse_merch_banner: true,
    enable_player_param_truncation_before_navigation_on_web: true,
    enable_sasde_for_html: false,
    web_amsterdam_playlists: false,
    web_animated_like: false,
    web_animated_like_lazy_load: false,
    web_button_rework: false,
    web_darker_dark_theme: false,
    web_guide_ui_refresh: false,
    kevlar_refresh_gesture: false,
    web_snackbar_ui_refresh: false,
    kevlar_modern_sd: false,
    c3_watch_page_component: false,
    botguard_periodic_refresh: false,
    kevlar_snap_state_refresh: false,
    web_appshell_refresh_trigger: false,
    kevlar_player_new_bootstrap_adoption: false,
    live_chat_use_new_emoji_picker: false,
    use_new_nwl_initialization: false,
    use_new_nwl_saw: false,
    use_new_nwl_stw: false,
    use_new_nwl_wts: false,
    web_player_use_new_api_for_quality_pullback: false,
    kevlar_guide_refresh: false,
    web_sheets_ui_refresh: false,
    web_modern_buttons: false,
    desktop_use_new_history_manager: false,
    web_modern_ads: false,
    enable_programmed_playlist_redesign: false,
    web_modern_chips: false,
    web_modern_dialogs: false,
    web_modern_playlists: false,
    web_modern_subscribe: false,
    web_rounded_containers: false,
    web_rounded_thumbnails: false,
    web_searchbar_style: "default",
    web_segmented_like_dislike_button: false,
    web_sheets_ui_refresh: false,
    kevlar_flexible_menu: false,
    kevlar_live_report_menu_item: true,
    kevlar_modern_sd: false,
    kevlar_refresh_on_theme_change: false,
    kevlar_updated_logo_icons: false,
    kevlar_watch_cinematics: false,
    kevlar_transcript_panel_refreshed_styles: false,
    kevlar_use_one_platform_for_queue_refresh: false,
    kevlar_watch_hide_comments_teaser: false,
    kevlar_watch_metadata_refresh: false,
    web_modern_subscribe_style: false,
    kevlar_watch_metadata_refresh_attached_subscribe: false,
    kevlar_watch_metadata_refresh_clickable_description: false,
    kevlar_watch_metadata_refresh_compact_view_count: false,
    kevlar_watch_metadata_refresh_description_info_dedicated_line: false,
    kevlar_watch_metadata_refresh_description_inline_expander: false,
    kevlar_watch_metadata_refresh_description_lines: 3,
    kevlar_watch_metadata_refresh_for_live_killswitch: false,
    kevlar_watch_metadata_refresh_top_aligned_actions: false,
    kevlar_watch_metadata_refresh_clickable_description: false,
    kevlar_watch_metadata_refresh_full_width_description: false,
    kevlar_watch_metadata_refresh_lower_case_video_actions: false,
    kevlar_watch_metadata_refresh_narrower_item_wrap: false,
    kevlar_watch_metadata_refresh_description_primary_color: false,
    kevlar_watch_metadata_refresh_full_width_description: false,
    kevlar_watch_metadata_refresh_relative_date: false,
    kevlar_use_ytd_player: false,
    kevlar_watch_modern_metapanel: false,
    kevlar_watch_modern_panels: false
}

// Player flags
// !!! USE STRINGS FOR VALUES !!!
// For example: "true" instead of true
const PLYRFLAGS = {
    web_player_move_autonav_toggle: "false"
}

class YTP {
    static observer = new MutationObserver(this.onNewScript);

    static _config = {};

    static isObject(item) {
        return (item && typeof item === "object" && !Array.isArray(item));
    }

    static mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return this.mergeDeep(target, ...sources);
    }


    static onNewScript(mutations) {
        for (var mut of mutations) {
            for (var node of mut.addedNodes) {
                YTP.bruteforce();
            }
        }
    }

    static start() {
        this.observer.observe(document, {childList: true, subtree: true});
    }

    static stop() {
        this.observer.disconnect();
    }

    static bruteforce() {
        if (!window.yt) return;
        if (!window.yt.config_) return;

        this.mergeDeep(window.yt.config_, this._config);
    }

    static setCfg(name, value) {
        this._config[name] = value;
    }

    static setCfgMulti(configs) {
        this.mergeDeep(this._config, configs);
    }

    static setExp(name, value) {
        if (!("EXPERIMENT_FLAGS" in this._config)) this._config.EXPERIMENT_FLAGS = {};

        this._config.EXPERIMENT_FLAGS[name] = value;
    }

    static setExpMulti(exps) {
        if (!("EXPERIMENT_FLAGS" in this._config)) this._config.EXPERIMENT_FLAGS = {};

        this.mergeDeep(this._config.EXPERIMENT_FLAGS, exps);
    }

    static decodePlyrFlags(flags) {
        var obj = {},
            dflags = flags.split("&");

        for (var i = 0; i < dflags.length; i++) {
            var dflag = dflags[i].split("=");
            obj[dflag[0]] = dflag[1];
        }

        return obj;
    }

    static encodePlyrFlags(flags) {
        var keys = Object.keys(flags),
            response = "";

        for (var i = 0; i < keys.length; i++) {
            if (i > 0) {
                response += "&";
            }
            response += keys[i] + "=" + flags[keys[i]];
        }

        return response;
    }

    static setPlyrFlags(flags) {
        if (!window.yt) return;
        if (!window.yt.config_) return;
        if (!window.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS) return;
        var conCfgs = window.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS;
        if (!("WEB_PLAYER_CONTEXT_CONFIGS" in this._config)) this._config.WEB_PLAYER_CONTEXT_CONFIGS = {};

        for (var cfg in conCfgs) {
            var dflags = this.decodePlyrFlags(conCfgs[cfg].serializedExperimentFlags);
            this.mergeDeep(dflags, flags);
            this._config.WEB_PLAYER_CONTEXT_CONFIGS[cfg] = {
                serializedExperimentFlags: this.encodePlyrFlags(dflags)
            }
        }
    }
}

window.addEventListener("yt-page-data-updated", function tmp() {
    YTP.stop();
    for (i = 0; i < ATTRS.length; i++) {
        document.getElementsByTagName("html")[0].removeAttribute(ATTRS[i]);
    }
    window.removeEventListener("yt-page-date-updated", tmp);
});

YTP.start();

YTP.setCfgMulti(CONFIGS);
YTP.setExpMulti(EXPFLAGS);
YTP.setPlyrFlags(PLYRFLAGS);
