.PHONY: build size tags tar test run ssh circle push release readme install

REPO=maliceio/malice-kibana-plugin
BUILDER=blacktop/kibana-plugin-builder
VERSION?=$(shell jq -r '.version' package.json)


readme: ## Update docker image size in README.md
	sed -i.bu 's/-	Kibana.*/-	Kibana $(VERSION)+/' README.md
	sed -i.bu 's/v.*\/malice-.*/v$(VERSION)\/malice-$(VERSION).zip/' README.md

install: ## npm install plugin dependancies
	@echo "===> malice-plugin npm install..."
	docker run --init --rm -v `pwd`:/plugin/malice $(BUILDER):$(VERSION) bash -c "cd ../malice && npm install"

elasticsearch:
	@echo "===> Starting kibana elasticsearch..."
	@docker run --init -d --name kplug -v `pwd`:/plugin/malice -p 9200:9200 -p 5601:5601 $(BUILDER):$(VERSION) elasticsearch

load-data:
	@echo "===> Adding data..."
	@docker exec -it kplug bash -c "cd ../malice/data && ./load-data.sh"

run: stop elasticsearch load-data ## Run malice kibana plugin env
	@open https://localhost:5601/
	@echo "===> Running kibana plugin..."
	@docker exec -it kplug bash -c "cd ../malice && ./start.sh"

ssh: ## SSH into docker image
	@docker run --init -it --rm -v `pwd`:/plugin/malice --entrypoint=sh $(BUILDER):$(VERSION)

plugin: stop elasticsearch install ## Build kibana malice plugin
	@echo "===> Building kibana plugin..."
	@sleep 10; docker exec -it kplug bash -c "cd ../malice && npm run build"
	@echo "===> Build complete"
	@ls -lah build
	@docker rm -f kplug || true

test: stop elasticsearch ## Test build plugin
	@echo "===> Testing kibana plugin..."
	@sleep 10; docker exec -it -u root kplug bash -c "cd ../malice && apk add --no-cache chromium && npm install karma-chrome-launcher && CHROME_BIN=/usr/bin/chromium-browser npm run test:browser --force"
	@docker rm -f kplug || true

release: readme plugin stop ## Create a new release
	@echo "===> Creating Release"
	rm -rf release && mkdir release
	go get github.com/progrium/gh-release/...
	cp build/* release
	gh-release create $(REPO) $(VERSION) \
		$(shell git rev-parse --abbrev-ref HEAD) $(VERSION)

clean: stop ## Clean builds
	rm -rf build/

stop: ## Kill running kibana-plugin docker containers
	@echo "===> Stopping kibana elasticsearch..."
	@docker rm -f kplug || true

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
